import {
  JobCard,
  JobCardBadge,
  JobCardContent,
  JobCardFooter,
  JobCardHeader,
  JobCardMeta,
  JobCardTitle,
} from '@/components/job-card'
import { JobDetailsSheet } from '@/components/job-details-sheet'
import { JobActions } from '@/components/job/job-action'
import Empty from '@/components/ui/empty'
import Spinner from '@/components/ui/spinner'
import { useGetCompanyJobsQuery } from '@/store/services/company.service'
import { JobResponseType } from '@/types/redux'
import { formatDistanceToNow } from 'date-fns'
import { tailspin } from 'ldrs'
import { MapIcon } from 'lucide-react'
import { memo, useState } from 'react'

tailspin.register()

// Default values shown

const AllActiveCompanyJobs = memo(() => {
  const { data, isFetching, isLoading } = useGetCompanyJobsQuery('active', {
    refetchOnMountOrArgChange: true,
  })
  const [selectedJob, setSelectedJob] = useState<JobResponseType | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="flex max-h-full flex-col gap-2 overflow-auto px-4">
      <h1 className={'flex items-center gap-x-2 text-xl font-semibold'}>
        <span>All Active Jobs </span>
        {(isFetching || isLoading) && (
          <Spinner className="mr-2 size-3.5 animate-spin fill-primary text-white" />
        )}
      </h1>
      <div className="flex flex-col gap-2">
        {data && data?.length > 0 ? (
          data?.map((job) => (
            <div key={job._id}>
              <JobCard
                onClick={() => {
                  setSelectedJob(job)
                  setIsSheetOpen(true)
                }}>
                <JobCardHeader>
                  <div className="size-12 rounded-lg border bg-secondary flex items-center justify-center">
                    {/* Placeholder logo if no image */}
                    <span className="text-xl font-bold text-muted-foreground">
                      {job.company.name?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <JobCardTitle>{job.title}</JobCardTitle>
                    <JobCardMeta className="mt-1">
                      <span>{job.company.name}</span>
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      <span className="capitalize">{job.type}</span>
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                      <span>{job.salaryRange}</span>
                    </JobCardMeta>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(job.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </JobCardHeader>

                <JobCardContent>
                  <p className="line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.requirements?.slice(0, 3).map((req, i) => (
                      <JobCardBadge key={i}>{req}</JobCardBadge>
                    ))}
                    {(job.requirements?.length || 0) > 3 && (
                      <JobCardBadge variant="outline">
                        +{(job.requirements?.length || 0) - 3} more
                      </JobCardBadge>
                    )}
                  </div>
                </JobCardContent>

                <JobCardFooter>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapIcon className="h-4 w-4" />
                    {job.location}
                  </div>
                  <JobActions
                    context={'active'}
                    id={job._id}
                    isArchived={job.isArchived}
                    onClick={(e) => e.stopPropagation()}
                  />
                </JobCardFooter>
              </JobCard>
            </div>
          ))
        ) : (
          <Empty rootClassName={'justify-self-center mt-8'} />
        )}
      </div>

      <JobDetailsSheet
        job={selectedJob}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        mode="view"
      />
    </div>
  )
})

AllActiveCompanyJobs.displayName = 'AllActiveCompanyJobs'
export { AllActiveCompanyJobs }
