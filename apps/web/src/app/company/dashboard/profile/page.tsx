import { CompanyProfileForm } from '@/app/company/dashboard/profile/components/company-form'
import { useGetMyCompanyQuery } from '@/store/services/company.service'
import { memo } from 'react'

const CompanyProfilePage = memo(() => {
  const { data } = useGetMyCompanyQuery();
  return (
    <div className='flex p-4 flex-col min-h-full max-h-full  overflow-y-auto'>
      <CompanyProfileForm initialData={data ? data[0] : undefined} />
    </div>
  );
});
CompanyProfilePage.displayName = 'CompanyProfilePage';

export { CompanyProfilePage };
