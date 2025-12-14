import { UserDocument } from '../../models/user.model'

const apiKey = process.env.RESEND_API_KEY
const from = process.env.RESEND_FROM
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

if (!apiKey || !from) {
  throw new Error(
    'Missing RESEND_API_KEY or RESEND_FROM environment variables.',
  )
}

let resendClient: any | null = null
const getResend = async () => {
  if (resendClient) return resendClient
  const { Resend } = await import('resend')
  resendClient = new Resend(apiKey as string)
  return resendClient
}

export const sendVerificationEmail = async (user: UserDocument) => {
  const verificationUrl = `${baseUrl}/email-verification/${user.verificationToken}`
  const resend = await getResend()
  const { data, error } = await resend.emails.send({
    from,
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  })

  if (error) {
    throw new Error(`Resend sendVerificationEmail failed: ${error.message}`)
  }

  return data
}

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `${baseUrl}/reset-password/${token}`
  const resend = await getResend()
  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: 'Password Reset',
    text: `Click here to reset your password: ${resetUrl}`,
    html: `<p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  })

  if (error) {
    throw new Error(`Resend sendResetPasswordEmail failed: ${error.message}`)
  }

  return data
}
