import nodemailer from 'nodemailer'
import { UserDocument } from '@server/models/user.model.ts'

const email = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS

if (!email || !pass) {
  throw Error(
    'Email and password not provided, Please add EMAIL_USER and EMAIL_PASS to .env file.\n if you are using a Gmail account, EMAIL_USER should be your Gmail address and EMAIL_PASS should be the app-specific password generated for your Gmail account.',
  )
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, //true for 465 port, false for other ports
  auth: {
    user: email,
    pass,
  },
})

export const sendVerificationEmail = async (user: UserDocument) => {
  const verificationUrl = `${process.env.BASE_URL}/email-verification/${user.verificationToken}`
  const mailOptions = {
    from: email,
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
  }

  await transporter.sendMail(mailOptions)
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`
  const mailOptions = {
    from: email,
    to: email,
    subject: 'Password Reset',
    text: `Click here to reset your password: ${resetUrl}`,
  }

  await transporter.sendMail(mailOptions)
}
