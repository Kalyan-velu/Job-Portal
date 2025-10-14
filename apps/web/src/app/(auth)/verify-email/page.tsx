'use web'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { useResendVerificationEmailMutation } from '@/store/services/user.service'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function VerifyEmailCard() {
  const navigate = useNavigate()
  const [resend, { isLoading: isResending }] =
    useResendVerificationEmailMutation()
  // const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')

  const handleResendEmail = async () => {
    setResendStatus('idle')

    // Simulating an API call to resend the verification email

    await resend()
      .unwrap()
      .then(() => {
        toast('Verification email resent successfully!')
        return
      })
      .catch((e) => {
        if (e === 'Email is already verified') {
          return navigate('/')
        }
        toast.error('Failed to resend verification email. Please try again.', {
          description: e,
        })
      })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Mail className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-4">
            We've sent a verification email to your inbox. Please click the link
            in the email to verify your account.
          </p>
          {resendStatus === 'success' && (
            <p className="mb-2 text-sm text-green-600">
              Verification email resent successfully!
            </p>
          )}
          {resendStatus === 'error' && (
            <p className="mb-2 text-sm text-red-600">
              Failed to resend verification email. Please try again.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleResendEmail}
            disabled={isResending}>
            {isResending ? 'Resending...' : 'Resend Verification Email'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
