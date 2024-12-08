import { AppSidebar } from '@/components/app-sidebar';
import BreadcrumbNavigation from '@/components/ui/breadcrumb-navigation';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const CompanyDashboardPage = memo(() => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 h-4'
            />
            <BreadcrumbNavigation />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          {/* <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            <div className='aspect-video rounded-xl bg-muted/50' />
            <div className='aspect-video rounded-xl bg-muted/50' />
            <div className='aspect-video rounded-xl bg-muted/50' />
          </div> */}
          <div className='h-full max-h-[calc(100dvh_-_10dvh)] p-2 flex-1 rounded-xl bg-muted/50 '>
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
});
CompanyDashboardPage.displayName = 'CompanyDashboardPage';
export { CompanyDashboardPage };