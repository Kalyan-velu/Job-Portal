import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useForgotPasswordMutation } from '@/store/services/user.service'
import { Link } from 'react-router-dom'
const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export function ForgotPassword() {
  const [requestEmail, { isLoading }] = useForgotPasswordMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await requestEmail(values)
      .unwrap()
      .then(() => {
        toast('Password Reset Email Sent', {
          description:
            'If an account exists for this email, you will receive password reset instructions.',
        })
        form.reset()
      })
      .catch((e) => {
        console.debug('ℹ️ ~ file: page.tsx:52 ~ onSubmit ~ e:', e)
        toast.error('An error occurred', {
          description: e ?? 'Please try again later.',
        })
      })
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" className="px-0" asChild>
            <Link to="/login">Back to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
