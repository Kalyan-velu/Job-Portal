import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { JobResponseType } from '@/types/redux'

import { memo, type ReactNode } from 'react'

interface JobDialogProps {
  children?: ReactNode
  job: JobResponseType
}

const JobUpdateDialog = memo<JobDialogProps>(({ children, job }) => {
  return (
    <Dialog>
      {children ?? <DialogTrigger>Open Dialog</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>Update job details</DialogDescription>
      </DialogContent>
    </Dialog>
  )
})

JobUpdateDialog.displayName = 'JobUpdateDialog'
export { JobUpdateDialog }
