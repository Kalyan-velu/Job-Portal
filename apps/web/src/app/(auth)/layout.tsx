import { ModeToggle } from '@/components/ui/theme-toggle'
import { MeshGradient } from '@paper-design/shaders-react'
import { memo } from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = memo(() => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none">
        <MeshGradient
          width={1920}
          height={1080}
          colors={['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']} // Blue, Purple, Pink, Cyan
          distortion={1}
          speed={0.5}
          grainOverlay={true}
        />
      </div>

      <ModeToggle className={'absolute top-6 right-6 z-20'} />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md p-4 animate-fade-in-up">
        <Outlet />
      </div>
    </div>
  )
})

AuthLayout.displayName = 'AuthLayout'

export { AuthLayout }
