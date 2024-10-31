import ApplicantNavbar from '@/components/hub/layout-navbar'
import { memo } from 'react'
import { Outlet } from 'react-router-dom'

const JobHubLayout = memo(() => {
  return (
    <div className={'h-full max-h-full overflow-y-auto'}>
      <ApplicantNavbar />
      <Outlet />
    </div>
  )
})
JobHubLayout.displayName = 'JobHubLayout'
export { JobHubLayout }
