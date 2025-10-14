import { ApplyJob } from '@/components/hub/apply-job-button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppliedJobIdsQuery } from '@/store/services/applicant.service'
import type { PublicJobResponse } from '@/types/redux'
import { Calendar, DollarSign, MapPin } from 'lucide-react'
import { memo, type ReactNode } from 'react'

interface DetailsJobProp {
  children?: ReactNode
  selectedJob?: PublicJobResponse
}

export const JobDetailedView = memo<DetailsJobProp>(
  ({ children, selectedJob }) => {
    const token = localStorage.getItem('token')

    const { data: appliedJobs } = useAppliedJobIdsQuery(undefined, {
      skip: !token,
    })
    return (
      <Dialog>
        {children}
        <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedJob.title}</span>
                  <Badge variant="secondary">{selectedJob.type}</Badge>
                </DialogTitle>
                <DialogDescription>
                  <p className="text-lg font-semibold">{selectedJob.company}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Posted on {selectedJob.postedDate}</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Job Description
                  </h3>
                  <p>{selectedJob.description}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Requirements</h3>
                  <ul className="list-disc space-y-1 pl-5">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Responsibilities
                  </h3>
                  <ul className="list-disc space-y-1 pl-5">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <ApplyJob
                companyId={selectedJob.companyId}
                jobId={selectedJob.id}
                applied={appliedJobs?.includes(selectedJob.id)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    )
  },
)
