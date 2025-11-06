import ApplicantProfileForm from '@/app/hub/profile/components/applicant.profile'
import { useGetApplicantProfileQuery } from '@/store/services/applicant.service'
import { memo } from 'react'

const ApplicantForm = memo(() => {
  const { data } = useGetApplicantProfileQuery()
  return (
    <div className="px-4">
      {data && (
        <ApplicantProfileForm
          defaultValues={{
            phone: data?.phone ?? '',
            resumeLink: data?.resumeLink ?? '',
            coverLetter: data?.coverLetter,
            linkedin: data?.linkedin,
            education: data?.education ?? [
              {
                degree: '',
                institution: '',
                startDate: new Date(),
                endDate: new Date(),
                description: '',
              },
            ],
            skills: data?.skills ?? [{ name: '', description: '' }],
            experiences: data?.experiences ?? [
              {
                title: '',
                company: '',
                location: '',
                startDate: new Date(),
                endDate: new Date(),
                description: '',
              },
            ],
          }}
        />
      )}
    </div>
  )
})
ApplicantForm.displayName = 'ApplicantForm'
export { ApplicantForm }
