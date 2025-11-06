import { ThemeProvider } from '@/components/theme-provider'
import StoreProvider from '@/store/provider'
import { FC, type ReactNode } from 'react'
import { Toaster as SonnarToaster } from 'sonner'

export const AppProviders:FC<{ children: ReactNode }> = (({ children }) => {
  return (
    <>
    {/*<NuqsAdapter>*/}
      <StoreProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          {/* <AuthProvider> */}
          {children}
          {/* </AuthProvider> */}
          <SonnarToaster
            position="bottom-right"
            visibleToasts={6}
            duration={2000}
            toastOptions={{
              classNames: {
                toast: '', // toast: 'bg-primary',
                actionButton: 'bg-zinc-400',
                cancelButton: 'bg-orange-400',

                closeButton: 'bg-lime-400',
                error: 'bg-destructive text-destructive-foreground',
                success: 'bg-green-500 text-primary-foreground',
              },
            }}
          />
        </ThemeProvider>
      </StoreProvider>
    {/*</NuqsAdapter>*/}

  </>
  )
})


