import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { ReactNode } from 'react'

interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

const JobCard = React.forwardRef<HTMLDivElement, JobCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'relative flex min-h-32 w-full cursor-pointer flex-col gap-y-2 rounded-xl border bg-background/50 p-4 shadow-sm backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-md',
          className,
        )}
        {...props}>
        {children}
      </Card>
    )
  },
)
JobCard.displayName = 'JobCard'

const JobCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-start gap-4', className)} {...props}>
    {children}
  </div>
))
JobCardHeader.displayName = 'JobCardHeader'

const JobCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-bold leading-tight tracking-tight', className)}
    {...props}>
    {children}
  </h3>
))
JobCardTitle.displayName = 'JobCardTitle'

const JobCardMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-wrap items-center gap-2 text-sm text-muted-foreground',
      className,
    )}
    {...props}>
    {children}
  </div>
))
JobCardMeta.displayName = 'JobCardMeta'

interface JobCardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

const JobCardBadge = React.forwardRef<HTMLDivElement, JobCardBadgeProps>(
  ({ className, children, variant = 'secondary', ...props }, ref) => (
    <Badge
      variant={variant}
      className={cn('rounded-full px-2 py-0.5 text-xs font-medium', className)}
      {...props}>
      {children}
    </Badge>
  ),
)
JobCardBadge.displayName = 'JobCardBadge'

const JobCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-2 text-sm text-muted-foreground', className)}
    {...props}>
    {children}
  </div>
))
JobCardContent.displayName = 'JobCardContent'

const JobCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 flex items-center justify-between', className)}
    {...props}>
    {children}
  </div>
))
JobCardFooter.displayName = 'JobCardFooter'

export {
  JobCard,
  JobCardBadge,
  JobCardContent,
  JobCardFooter,
  JobCardHeader,
  JobCardMeta,
  JobCardTitle,
}
