import nodemailer from 'nodemailer'
import { UserDocument } from '../../models/user.model'

const sender = process.env.EMAIL_USER
const clientId = process.env.EMAIL_CLIENT_ID
const clientSecret = process.env.EMAIL_CLIENT_SECRET
const refreshToken = process.env.EMAIL_REFRESH_TOKEN
const accessToken = process.env.EMAIL_ACCESS_TOKEN
if (!sender || !clientId || !clientSecret || !refreshToken || !accessToken) {
  throw new Error(
    'Missing EMAIL_USER, EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, or EMAIL_REFRESH_TOKEN for Gmail OAuth2.',
  )
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: sender,
    clientId,
    clientSecret,
    refreshToken,
    accessToken,
  },
})

export const sendVerificationEmail = async (user: UserDocument) => {
  const verificationUrl = `${process.env.BASE_URL}/email-verification/${user.verificationToken}`
  const mailOptions = {
    from: sender,
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
  }

  return transporter.sendMail(mailOptions)
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`
  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Password Reset',
    text: `Click here to reset your password: ${resetUrl}`,
  }

  return transporter.sendMail(mailOptions)
}
