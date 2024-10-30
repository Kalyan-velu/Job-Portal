import { User as UserModel } from '@server/models/user.model'
import 'dotenv/config'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { sendErrorResponse } from '../common/response'
import type { Role, User } from '../types'
const jwtSecret = process.env.JWT_SECRET // Store this securely
console.debug('ℹ️ ~ file: auth.middleware.ts:7 ~ jwtSecret:', jwtSecret)

export const createSession = (req: Request, res: Response): string => {
  // Define the payload for the token
  const payload = req.user

  // Define your JWT secret and options
  const secret = process.env.JWT_SECRET // Use environment variables for security
  const options = { expiresIn: '24h' } // Token expiration time

  // Generate the token
  const token = jwt.sign(
    { id: req.user._id, role: req.user?.role },
    secret,
    options,
  )
  res.cookie('auth_token', token, {
    httpOnly: true, // Helps mitigate XSS attacks
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    maxAge: 3600000, // 1 hour in milliseconds
  })

  // Set the token in the response header (optional)
  res.setHeader('Authorization', `Bearer ${token}`)

  // Optionally, store the session in your database here
  // e.g., sessionStore.createSession(user.id, token);

  return token // Return the token for further use if needed
}

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return sendErrorResponse(res, 'Access denied. No token provided.', 401)
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string } // Ensure decoded has the `_id` field

    // Fetch the user using lean() to improve performance
    const user = await UserModel.findById(decoded.id, '-password').lean()

    if (!user) {
      sendErrorResponse(res, 'Invalid Token', 401)
      return
    }
    if (user) {
      user.id = user._id.toString() // Manually add id if it's not working
      delete user._id // Optionally remove _id
      req.user = user
    }
    // Attach user information to the request

    // Proceed to the next middleware
    next()
  } catch (err) {
    console.error('ℹ️ ~ jwtAuth Middleware Error:', err)
    sendErrorResponse(res, 'Invalid Token', 401)
    return
  }
}

export const sessionAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //@ts-ignore
  if (req.session && req.session.user) {
    //@ts-ignore
    req.user = req.session.user // Attach user information to the request
    next()
  }
  sendErrorResponse(res, 'Unauthorized access. No active session.', 401)
}

export const oauthAuth = (req: Request, res: Response, next: NextFunction) => {
  // Implement your OAuth verification logic here
  const accessToken = req.headers['authorization']

  if (isValidOAuthToken(accessToken)) {
    req.user = getUserFromToken(accessToken) // Mock function
    next()
  }
  sendErrorResponse(res, 'Invalid OAuth token.', 401)
}

// Mock functions for OAuth validation
const isValidOAuthToken = (token: string) => {
  // Implement validation logic
  return true // Replace with actual validation
}

const getUserFromToken = (token: string) => {
  // Mock user retrieval from token
  return { id: '123', name: 'John Doe' } as User & { id: string }
}

export const authorizeRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      res.status(403).json({ message: 'Access denied' })
      return
    }
    next()
  }
}
