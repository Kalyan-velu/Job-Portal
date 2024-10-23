import RegisterForm from '@/components/register-form';
import { memo } from 'react';

const Signup = memo(() => {
  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <RegisterForm />;
    </div>
  );
});
Signup.displayName = 'Signup';

export { Signup };
