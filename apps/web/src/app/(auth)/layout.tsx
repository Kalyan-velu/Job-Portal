import { ModeToggle } from '@/components/ui/theme-toggle';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = memo(() => {
  return (
    <div className='h-full w-full  relative'>
      <ModeToggle className={'absolute top-2 right-2'} />
      <Outlet />
    </div>
  );
});

AuthLayout.displayName = 'AuthLayout';

export { AuthLayout };
