import { AppProviders } from '@/providers'
import { memo } from 'react'
import { Outlet } from 'react-router-dom'

const RootLayout = memo(() => {
  return (
    <AppProviders>
      <main className={'h-dvh max-h-dvh w-dvw max-w-full  overflow-hidden'}>
        <Outlet />
      </main>
    </AppProviders>
  )
})

RootLayout.displayName = 'RootLayout'

export { RootLayout }
