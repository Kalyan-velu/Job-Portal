import { Button } from '@/components/ui/button'
import { useApplyJobMutation } from '@/store/services/applicant.service'
import { memo, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  jobId: string
  applied?: boolean
  companyId: string
}

const ApplyJob = memo<Props>(({ jobId, companyId, applied }) => {
  const token = localStorage.getItem('token')
  const [isApplied, setIsApplied] = useState(applied)
  const [apply, { isLoading: applying }] = useApplyJobMutation()
  const handleApply = async () => {
    if (applying) return
    toast.loading('Applying', { id: 'apply' })
    await apply({ jobId, companyId })
      .unwrap()
      .then(() => {
        toast.success('Application submitted.', { id: 'apply' })
        setIsApplied(true)
      })
      .catch((e) => {
        toast.error(e, { id: 'apply' })
      })
  }
  return (
    <div className="mt-6 flex w-full justify-end">
      {!token ? (
        <Button
          onClick={async (e) => {
            e.stopPropagation()
          }}>
          Login to apply
        </Button>
      ) : (
        <Button
          onClick={async (e) => {
            e.stopPropagation()
            await handleApply()
          }}
          disabled={isApplied}>
          {isApplied ? 'Applied' : 'Apply Now'}
        </Button>
      )}
    </div>
  )
})

ApplyJob.displayName = 'ApplyJob'
export { ApplyJob }
