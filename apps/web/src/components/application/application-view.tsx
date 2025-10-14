import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetApplicantDetailsQuery } from '@/store/services/company.service'
import { format } from 'date-fns'
import { memo, type ReactNode } from 'react'

// interface ApplicantDetails {
//   id: string
//   name: string
//   email: string
//   phone: string
//   resumeLink: string
//   coverLetter: string
//   education: {
//     degree: string
//     institution: string
//     startDate: string
//     endDate: string
//     description: string
//   }[]
//   skills: {
//     name: string
//     description: string
//   }[]
//   experiences: {
//     title: string
//     company: string
//     location: string
//     startDate: string
//     endDate: string
//     description: string
//   }[]
// }

interface ApplicantDetailedViewProp {
  children?: ReactNode
  applicationId: string
}

export const ApplicantDetailedView = memo<ApplicantDetailedViewProp>(
  ({ children, applicationId }) => {
    const { data: selectedApplicant } = useGetApplicantDetailsQuery(
      { applicationId },
      {
        refetchOnMountOrArgChange: true,
      },
    )
    return (
      <Dialog>
        {children}
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
          {selectedApplicant && (
            <>
              <DialogHeader className="mb-4 flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {selectedApplicant.contactInfo.email ?? 'Unnamed Applicant'}
                </DialogTitle>
                <Badge variant="secondary">
                  {selectedApplicant.jobApplication.applicationStatus}
                </Badge>
              </DialogHeader>
              <DialogDescription className="mb-6 text-gray-700">
                <p className="text-lg font-semibold">Contact Information</p>
                {selectedApplicant.contactInfo.email && (
                  <p>
                    Email:{' '}
                    <span className="text-gray-600">
                      {selectedApplicant.contactInfo.email}
                    </span>
                  </p>
                )}
                {selectedApplicant.contactInfo.phone && (
                  <p>
                    Phone:{' '}
                    <span className="text-gray-600">
                      {selectedApplicant.contactInfo.phone}
                    </span>
                  </p>
                )}
                {selectedApplicant.linkedinProfile && (
                  <p>
                    LinkedIn:
                    <a
                      href={selectedApplicant.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline">
                      {selectedApplicant.linkedinProfile}
                    </a>
                  </p>
                )}
                {selectedApplicant.resumeLink && (
                  <p>
                    <a
                      href={selectedApplicant.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline">
                      View Resume
                    </a>
                  </p>
                )}
                {selectedApplicant.coverLetter && (
                  <p>
                    <strong>Cover Letter:</strong>{' '}
                    <span className="text-gray-600">
                      {selectedApplicant.coverLetter}
                    </span>
                  </p>
                )}
              </DialogDescription>
              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Education
                  </h3>
                  {selectedApplicant.education.length > 0 ? (
                    selectedApplicant.education.map((edu, index) => (
                      <div
                        key={index}
                        className="mb-3 rounded-lg border bg-gray-100 p-4">
                        <p className="font-semibold">
                          {edu.degree} from {edu.institution}
                        </p>
                        <p className="text-gray-600">
                          {format(new Date(edu.startDate), 'dd/MM/yyyy')} -{' '}
                          {edu.endDate
                            ? format(new Date(edu.endDate), 'dd/MM/yyyy')
                            : 'Present'}
                        </p>
                        {edu.description && (
                          <p className="text-gray-500">{edu.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No education information available.
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Skills
                  </h3>
                  {selectedApplicant.skills.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {selectedApplicant.skills.map((skill, index) => (
                        <li key={index} className="text-gray-600">
                          <strong>{skill.name}:</strong>{' '}
                          {skill.description ?? 'No description provided.'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No skills listed.</p>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Experience
                  </h3>
                  {selectedApplicant.experiences.length > 0 ? (
                    selectedApplicant.experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="mb-3 flex flex-col gap-2 rounded-lg border bg-gray-100 p-4">
                        <p className="font-semibold">
                          {exp.title} at {exp.company}
                        </p>
                        <p className="text-gray-600">
                          {format(new Date(exp.startDate), 'dd/MM/yyyy')} -{' '}
                          {exp.endDate
                            ? format(new Date(exp.endDate), 'dd/MM/yyyy')
                            : 'Present'}
                          <span className={'mx-2'}>|</span>
                          {exp.location}
                        </p>
                        {exp.description && (
                          <p className="text-gray-500">{exp.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No work experience listed.</p>
                  )}
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Job Application
                </h3>
                <p className="text-gray-600">
                  Applied for: {selectedApplicant.jobApplication.jobTitle}
                </p>
                <p className="text-gray-600">
                  Application Status:{' '}
                  {selectedApplicant.jobApplication.applicationStatus}
                </p>
                <p className="text-gray-600">
                  Applied on:{' '}
                  {new Date(
                    selectedApplicant.jobApplication.appliedAt,
                  ).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    )
  },
)
