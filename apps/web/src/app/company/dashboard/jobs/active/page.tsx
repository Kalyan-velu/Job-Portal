import { JobActions } from '@/components/job/job-action'
import { JobUpdateDialog } from '@/components/job/job-update-dialog'
import { Badge } from '@/components/ui/badge'
import { DialogTrigger } from '@/components/ui/dialog'
import Empty from '@/components/ui/empty'
import Spinner from '@/components/ui/spinner'
import { useGetCompanyJobsQuery } from '@/store/services/company.service'
import { formatDistanceToNow } from 'date-fns'
import { tailspin } from 'ldrs'
import { MapIcon } from 'lucide-react'
import { memo } from 'react'

tailspin.register()

// Default values shown

const AllActiveCompanyJobs = memo(() => {
  const { data, isFetching, isLoading } = useGetCompanyJobsQuery('active', {
    refetchOnMountOrArgChange: true,
  })
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
            <JobUpdateDialog job={job}>
              <DialogTrigger asChild>
                <div
                  key={job._id}
                  className="relative flex min-h-32 w-full cursor-pointer flex-col gap-y-2 rounded-lg bg-secondary p-3 text-secondary-foreground shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="size-12 rounded-lg border border-solid border-gray-400 bg-gray-400" />
                    <div className="flex flex-col justify-start gap-1">
                      <h3 className="text-lg font-semibold hover:cursor-pointer">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-x-2">
                        <p className="text-xs font-medium text-gray-400">
                          {job.company.name}
                        </p>
                        <div className="size-1 rounded-full bg-gray-500"></div>
                        <div className="rounded-full text-xs font-medium capitalize text-gray-400">
                          {job.type.replace('-', ' ')}
                        </div>
                        <div className="size-1 rounded-full bg-gray-500"></div>
                        <p className="text-xs font-medium">{job.salaryRange}</p>
                      </div>
                    </div>
                    <div className="grow" />
                    <div className="flex items-center gap-x-2">
                      <p className="flex gap-x-2 text-xs font-medium text-gray-400">
                        <MapIcon className={'size-4'} />
                        <span>{job.location}</span>
                      </p>
                      <div className="size-1 rounded-full bg-gray-500"></div>
                      <p className="text-xs font-medium capitalize text-gray-400">
                        {formatDistanceToNow(new Date(job.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{job.description}</p>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    data-hidden={
                      !(job.responsibilites && job.responsibilites?.length > 0)
                    }
                    className="flex flex-col gap-2 data-[hidden=true]:hidden">
                    <p className="text-md font-semibold">Responsibilities</p>
                    <ul
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      role="list">
                      {job.responsibilites?.map((responsibility) => (
                        <li
                          className={'flex items-center gap-x-1 pl-2 text-sm'}
                          key={responsibility}>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2">
                    {/* <p className="text-md font-semibold">Requirements : </p> */}
                    {job.requirements?.map((r) => (
                      <Badge
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        key={r}
                        className={'rounded-full text-xs'}>
                        {r}
                      </Badge>
                    ))}
                  </div>
                  <JobActions
                    context="active"
                    id={job?._id}
                    isArchived={job.isArchived}
                    className={'absolute bottom-2 right-2'}
                  />
                </div>
              </DialogTrigger>
            </JobUpdateDialog>
          ))
        ) : (
          <Empty rootClassName={'justify-self-center mt-8'} />
        )}
      </div>
    </div>
  )
})

AllActiveCompanyJobs.displayName = 'AllActiveCompanyJobs'
export { AllActiveCompanyJobs }