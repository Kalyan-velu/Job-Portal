import { ThemeProvider } from '@/components/theme-provider';
import StoreProvider from '@/store/provider';
import { memo, type ReactNode } from 'react';
import { Toaster as SonnarToaster } from 'sonner';
const AppProviders = memo<{ children: ReactNode }>(({ children }) => {
  return (
    <StoreProvider>
      <ThemeProvider
        defaultTheme='dark'
        storageKey='vite-ui-theme'
      >
        {/* <AuthProvider> */}
        {children}
        {/* </AuthProvider> */}
        <SonnarToaster />
      </ThemeProvider>
    </StoreProvider>
  );
});

AppProviders.displayName = 'AppProviders';

export { AppProviders };
