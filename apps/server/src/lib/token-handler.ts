import crypto from 'crypto'
import { User } from '../models/user.model'
import { sendResetPasswordEmail } from './mailer/nodemailer'

export const sendReset = async (email: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('User not found')
  }

  const token = crypto.randomBytes(32).toString('hex')
  user.resetPasswordToken = token
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour
  await user.save()
  return sendResetPasswordEmail(user.email, token)
}
export const verifyToken = async (token: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  })

  if (!user) {
    return null
  }

  return { userId: user._id }
}
