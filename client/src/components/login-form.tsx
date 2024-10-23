import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useLoginMutation } from '@/store/services/user.service';
import { loginSchema, type LoginSchemaType } from '@/zod-schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

export function LoginForm() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onValidSubmit = async (data: LoginSchemaType) => {
    await login(data)
      .unwrap()
      .then((r) => {
        if (r.redirectTo && r.message) {
          toast.info(r.message);
          return navigate(r.redirectTo);
        }
        navigate('/');
      })
      .catch((e) => {
        console.debug('ℹ️ ~ file: login-form.tsx:45 ~ onValidSubmit ~ e:', e);
        toast.error(e || 'Login failed');
      });
  };
  const onInvalidSubmit = (data: FieldErrors<LoginSchemaType>) => {
    // console.error(
    //   'ℹ️ ~ file: login-form.tsx:38 ~ onInvalidSubmit ~ data:',
    //   data
    // );
    // toast.error("Couldn't submit form");
  };
  return (
    <Form {...form}>
      <Card className='mx-auto max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
            className='grid gap-4'
          >
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor='email'>Email</Label>

                    <FormControl>
                      <Input
                        placeholder={'Enter your email'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='password' // This should be 'password' instead of 'email'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center'>
                      <Label htmlFor='password'>Password</Label>
                      <Link
                        to='#'
                        className='ml-auto inline-block text-sm underline'
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput
                        placeholder={'Enter your password'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading} // Optionally disable while loading
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link
              to='/register'
              className='underline'
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </Form>
  );
}
