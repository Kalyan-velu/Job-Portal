import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  useArchiveJobMutation,
  useDeleteJobMutation,
  useUnarchiveJobMutation,
} from '@/store/services/company.service'
import { Archive, ArchiveRestore, Edit2, Trash2 } from 'lucide-react'
import { forwardRef, memo, useCallback, type HTMLAttributes } from 'react'
import { toast } from 'sonner'

interface JobActionsProps extends HTMLAttributes<HTMLDivElement> {
  id: string
  isArchived: boolean
  context: 'all' | 'active' | 'archived'
}

const JobActions = memo(
  forwardRef<HTMLDivElement, JobActionsProps>(
    ({ className, id, context, isArchived, ...props }, ref) => {
      const [deleteJob, { isLoading }] = useDeleteJobMutation()
      const [archiveJob, { isLoading: isArchiving }] = useArchiveJobMutation()
      const [unarchiveJob, { isLoading: isUnarchiving }] =
        useUnarchiveJobMutation()
      const handleDelete = useCallback(async () => {
        if (isLoading || !id) return
        await deleteJob({ id, context })
          .unwrap()
          .then(() => {
            toast.success('Job deleted successfully.')
          })
          .catch((e) => {
            toast.error(e)
          })
      }, [id, context])
      const handleArchive = useCallback(async () => {
        if (isArchiving || !id) return
        await archiveJob({ id, context })
          .unwrap()
          .then(() => {
            toast.success('Job archived.')
          })
          .catch((e) => {
            toast.error(e)
          })
      }, [id, context])
      const handleUnArchive = useCallback(async () => {
        if (isUnarchiving || !id) return
        await unarchiveJob({ id, context })
          .unwrap()
          .then(() => {
            toast.success('Job unarchived.')
          })
          .catch((e) => {
            toast.error(e)
          })
      }, [id, context])

      return (
        <div ref={ref} className={cn('flex gap-2', className)} {...props}>
          {!isArchived ? (
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleArchive()
              }}
              className="size-8"
              variant="outline">
              <Archive />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                handleUnArchive()
              }}
              className="size-8"
              variant="outline">
              <ArchiveRestore />
            </Button>
          )}
          <Button size="icon" className="size-8" variant="outline">
            <Edit2 />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            size="icon"
            className="size-8"
            variant="destructive">
            <Trash2 />
          </Button>
        </div>
      )
    },
  ),
)

JobActions.displayName = 'JobActions'
export { JobActions }
