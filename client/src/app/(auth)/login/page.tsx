import { LoginForm } from '@/components/login-form';
import { memo } from 'react';

function LoginPage() {
  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <LoginForm />
    </div>
  );
}
export default memo(LoginPage);