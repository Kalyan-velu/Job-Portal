import { User as UserModel } from '../models/user.model'
import 'dotenv/config'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { sendErrorResponse } from '../common/response'
import type { Role, User } from '../types'
const jwtSecret = process.env.JWT_SECRET // Store this securely

if (!jwtSecret) throw new Error('JWT_SECRET is not defined')
console.debug('ℹ️ ~ file: auth.middleware.ts:7 ~ jwtSecret:', jwtSecret)

export const createSession = (req: Request, res: Response): string => {
  // Define the payload for the token
  // const payload = req.user

  const options = { expiresIn: '24h' } // Token expiration time

  // Generate the token
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    jwtSecret,
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
  console.debug(
    'ℹ️ ~ file: auth.middleware.ts:44 ~ req:',
    req.headers['authorization']?.split(' ')[1],
  )
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return sendErrorResponse(res, 'Access denied. No token provided.', 401)
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) // Ensure decoded has the `_id` field

    // Fetch the user using lean() to improve performance
    // @ts-expect-error - We're adding the user to the request object
    const user = await UserModel.findById(decoded.id, '-password').lean()

    if (!user) {
      sendErrorResponse(res, 'Invalid Token', 401)
      return
    }
    user.id = user._id.toString() // Manually add id if it's not working
    delete (user as any)._id // Optionally remove _id
    req.user = user
    // }
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
  // @ts-expect-error - We're adding the user to the request object
  if (req.session && req.session.user) {
    // @ts-expect-error - We're adding the user to the request object
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
const isValidOAuthToken = (token: string | undefined) => {
  if (!token) return false
  // Implement validation logic
  return true // Replace with actual validation
}

const getUserFromToken = (token: string | undefined) => {
  if (!token) return null
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
