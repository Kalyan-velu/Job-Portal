import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import {
  sendErrorResponse,
  sendSuccessResponse,
} from '../../../common/response'
import { sendVerificationEmail } from '../../../lib/mailer/nodemailer'
import { sendReset } from '../../../lib/token-handler'
import { createSession } from '../../../middlewares/auth.middleware'
import { User } from '../../../models/user.model'
import type {
  BaseUserRegisterSchemaType,
  LoginType,
} from '../../../zod/user.schema'

interface LoginRequest extends Request {
  body: LoginType
}

interface RegisterRequest extends Request {
  body: BaseUserRegisterSchemaType
}

export const Login = async (req: LoginRequest, res: Response) => {
  try {
    const userDoc = await User.findOne({ email: req.body.email })
    if (!userDoc) {
      sendErrorResponse(res, "User doesn't  exist", 402)
      return
    }
    const isPasswordValid = await userDoc.comparePassword(req.body.password)

    if (!isPasswordValid) {
      sendErrorResponse(res, 'Invalid password', 401)
      return
    }
    const user = userDoc.toJSON()
    req.user = { ...user }

    const token = createSession(req, res)

    if (user.role === 'employer' && !user.companyId) {
      sendSuccessResponse(res, {
        token,
        message: 'Please complete your company profile',
        redirectTo: '/app/employer/create',
        isVerified: user.isVerified,
      })
      return
    } else if (user.role === 'applicant' && !user.applicantId) {
      sendSuccessResponse(res, {
        token,
        message: 'Please complete your profile',
        redirectTo: '/app/jobs/profile',
        isVerified: user.isVerified,
      })
      return
    }

    sendSuccessResponse(
      res,
      { token, type: 'authorization', redirectTo: user.role, isVerified: true },
      'Success',
    )
    return
  } catch (e) {
    sendErrorResponse(res, e, 500)
    return
  }
}
export const Register = async (req: RegisterRequest, res: Response) => {
  try {
    const { role, email, password, name, phoneNumber } = req.body

    const userExist = await User.findOne({ email })
    if (userExist) {
      return sendErrorResponse(
        res,
        `User already exists with role ${userExist.role}.`,
        400,
      )
    }

    const newUser = new User({
      name,
      phoneNumber,
      email,
      password, // Remember to hash the password
      role,
    })

    await newUser.save()
    try {
      await sendVerificationEmail(newUser)
    } catch (e) {
      await newUser.deleteOne()
      if (e instanceof Error) {
        return sendErrorResponse(res, e.message, 500)
      }
      return sendErrorResponse(res, 'Internal server error', 500)
    }

    // Return the user without the password
    const { password: _p, ...user } = newUser.toJSON()

    return sendSuccessResponse(
      res,
      user,
      'User registered successfully. Please check your email to verify your account.',
    )
  } catch (e) {
    if (e instanceof Error) {
      return sendErrorResponse(res, e.message, 500)
    }
    return sendErrorResponse(res, 'Internal server error', 500)
  }
}

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query

    if (!token) {
      sendErrorResponse(res, 'Invalid verification token', 400)
      return
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    })

    if (!user) {
      sendErrorResponse(res, 'Invalid verification token', 400)
      return
    }
    if (user.isVerified) {
      sendSuccessResponse(res, {
        message: 'Email is already verified',
        verified: true,
      })
      return
    }
    user.isVerified = true
    user.verificationTokenExpires = undefined
    user.verificationToken = undefined
    await user.save()
    sendSuccessResponse(res, {
      message: 'Email verified successfully',
      verified: true,
    })
    return
  } catch (e) {
    console.debug('ℹ️ ~ file: auth.controller.ts:152 ~ verifyEmail ~ e:', e)
    if (e instanceof Error) {
      return sendErrorResponse(res, e.message, 500)
    }
    return sendErrorResponse(res, 'Internal server error', 500)
  }
}

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const email = req.user.email
    console.debug(
      'ℹ️ ~ file: auth.controller.ts:153 ~ resendVerificationEmail ~ email:',
      email,
    )
    if (!email) {
      sendErrorResponse(res, 'Email is required', 400)
      return
    }

    const user = await User.findOne({ email })
    if (!user) {
      sendErrorResponse(res, 'User not found', 404)
      return
    }

    if (user.isVerified) {
      sendErrorResponse(res, 'Email is already verified', 400)
      return
    }

    try {
      await sendVerificationEmail(user)
    } catch (e) {
      // await user.deleteOne()
      if (e instanceof Error) {
        return sendErrorResponse(res, e.message, 500)
      }
      return sendErrorResponse(res, 'Internal server error', 500)
    }
  } catch (e) {
    if (e instanceof Error) {
      return sendErrorResponse(res, e.message, 500)
    }
    return sendErrorResponse(res, 'Internal server error', 500)
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) {
      sendErrorResponse(res, 'Email is required', 400)
      return
    }
    try {
      await sendReset(email)
    } catch (e) {
      console.error('Could not send mail', e)
      sendErrorResponse(
        res,
        e instanceof Error ? e.message : 'Internal server error',
        500,
      )
      return
    }
    sendSuccessResponse(res, 'Reset password email sent successfully')
    return
  } catch (e) {
    if (e instanceof Error) {
      sendErrorResponse(res, e.message, 500)
      return
    }
    sendErrorResponse(res, 'Internal server error', 500)
    return
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body
    if (!token || !password) {
      sendErrorResponse(res, 'Token and password are required', 400)
      return
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user) {
      sendErrorResponse(res, 'Invalid or expired token', 400)
      return
    }
    // const salt = await bcrypt.genSalt(10) // Generate salt

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    sendSuccessResponse(res, 'Password reset successfully')
    return
  } catch (e) {
    if (e instanceof Error) {
      sendErrorResponse(res, e.message, 500)
      return
    }
    sendErrorResponse(res, 'Internal server error', 500)
    return
  }
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('auth_token')
  res.clearCookie('role')
  res.clearCookie('refresh_token')
  sendSuccessResponse(res, 'Logged out successfully')
  return
}

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refresh_token']

  if (!refreshToken) {
    sendErrorResponse(res, 'Access Denied. No refresh token provided.', 401)
    return
  }

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    if (!secret) throw new Error('JWT Secret is undefined')

    const decoded = jwt.verify(refreshToken, secret) as jwt.JwtPayload
    const user = await User.findById(decoded.id)
    if (!user) {
      res.clearCookie('refresh_token')
      res.clearCookie('auth_token')
      res.clearCookie('role')
      sendErrorResponse(res, 'Invalid verification token', 401)
      return
    }

    req.user = user
    const token = createSession(req, res)

    sendSuccessResponse(res, { token }, 'Token refreshed')
    return
  } catch (error) {
    res.clearCookie('refresh_token')
    res.clearCookie('auth_token')
    res.clearCookie('role')
    sendErrorResponse(res, 'Invalid refresh token.', 400)
    return
  }
}
