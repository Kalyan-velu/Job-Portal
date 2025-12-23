import 'dotenv/config'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { sendErrorResponse } from '../common/response'
import { User as UserModel } from '../models/user.model'
import type { Role, User } from '../types'
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) throw new Error('JWT_SECRET is not defined')

export const createSession = (req: Request, res: Response): string => {
  const options: jwt.SignOptions = { expiresIn: '15m' }
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    jwtSecret as jwt.Secret,
    options,
  )
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  })

  res.cookie('role', req.user.role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  })
  generateRefreshToken(req, res)
  return token
}

export const generateRefreshToken = (req: Request, res: Response) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || jwtSecret
  if (!secret)
    throw new Error('REFRESH_TOKEN_SECRET or JWT_SECRET is not defined')

  const options: jwt.SignOptions = { expiresIn: '7d' }
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    secret as jwt.Secret,
    options,
  )
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  return token
}

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies['auth_token']

  if (!token) {
    return sendErrorResponse(res, 'Access denied. No token provided.', 401)
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)

    // Fetch the user using lean() to improve performance
    // @ts-expect-error - We're adding the user to the request object
    const user = await UserModel.findById(decoded.id, '-password -__v').lean()

    if (!user) {
      sendErrorResponse(res, 'Invalid Token', 401)
      return
    }
    user.id = user._id.toString()
    delete (user as any)._id
    req.user = user
    next()
  } catch (err) {
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
