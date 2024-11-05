import { sendErrorResponse, sendSuccessResponse } from '@server/common/response'
import { Applicant } from '@server/models/applicant.model'
import { JobApplication } from '@server/models/application.model'
import { Request, Response } from 'express'
interface SubmitReq extends Request {
  body: { jobId: string; coverLetter?: string; companyId: string }
}
export const submitApplication = async (req: SubmitReq, res: Response) => {
  try {
    const { jobId, companyId, coverLetter } = req.body
    const applicantId = req.user?.applicantId // Assuming user is authenticated, with applicant ID available
    console.debug(
      'ℹ️ ~ file: job.controller.ts:12 ~ submitApplication ~ applicantId:',
      applicantId,
    )

    // Check if applicant profile is complete
    const applicantProfile = await Applicant.findById(applicantId)
    if (!applicantProfile) {
      sendErrorResponse(res, 'Applicant profile not found', 404)
      return
    }

    // Prevent duplicate applications for the same job
    const existingApplication = await JobApplication.findOne({
      jobId,
      applicantId,
    })
    if (existingApplication) {
      sendErrorResponse(res, 'You have already applied for this job', 400)
      return
    }

    // Create application with profile data
    const newApplication = new JobApplication({
      applicantId,
      jobId,
      companyId,
      resumeLink: applicantProfile.resumeLink,
      coverLetter,
      contactDetails: {
        phone: applicantProfile.phone,
        email: req.user?.email, // Assume email is available from authenticated user
      },
      linkedin: applicantProfile.linkedin,
      skills: applicantProfile.skills,
      experiences: applicantProfile.experiences,
      education: applicantProfile.education,
      applicationStatus: 'submitted',
      appliedAt: new Date(),
    })

    // Save application
    await newApplication.save()
    sendSuccessResponse(res, null, 'Application submitted successfully')
    return
  } catch (error) {
    sendErrorResponse(
      res,
      { message: 'Error submitting application', error },
      500,
    )
    return
  }
}

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params
    const application = await JobApplication.findById(applicationId)
    if (!application) {
      sendErrorResponse(res, { message: 'Application not found' }, 404)
      return
    }
    sendSuccessResponse(res, application)
    return
  } catch (e) {
    console.error(
      'ℹ️ ~ file: job.controller.ts:70 ~ getApplicationById ~ e:',
      e,
    )
    sendErrorResponse(
      res,
      { message: 'Error fetching application.', error: e },
      500,
    )
  }
}

// Function to list all applications for a specific applicant
export const listApplicationsForApplicant = async (
  req: Request,
  res: Response,
) => {
  try {
    const applicantId = req.user?.applicantId // Assuming the applicant is authenticated
    if (!applicantId) {
      sendErrorResponse(
        res,
        { message: 'Applicant ID is missing from request' },
        400,
      )
      return
    }

    // Retrieve applications with only the necessary fields
    const applications = await JobApplication.find({ applicantId })
      .populate({
        path: 'jobId',
        select: 'title company',
        populate: {
          path: 'company',
          select: 'name', // Assuming the Company model has a 'name' field
        },
      })
      .select('jobId applicationStatus appliedAt note')

    // Map applications to match the required format
    const formattedApplications = applications.map((application) => ({
      id: application._id,
      //@ts-expect-error  no error
      jobTitle: application.jobId.title,
      //@ts-expect-error no error
      company: application.jobId.company,
      status: application.applicationStatus,
      note: application.note,
      appliedDate: application.appliedAt.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
    }))

    sendSuccessResponse(res, formattedApplications)
    return
  } catch (error) {
    console.error('Error in listApplicationsForApplicant:', error)
    sendErrorResponse(
      res,
      { message: 'Error listing applications', error },
      500,
    )
    return
  }
}

// Function to delete an application
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params
    const applicantId = req.user?.applicantId

    // Check application ownership
    const application = await JobApplication.findOne({
      _id: applicationId,
      applicantId,
    })
    if (!application) {
      sendErrorResponse(res, { message: 'Application not found' }, 404)
      return
    }

    await application.deleteOne()
    sendSuccessResponse(res, null, 'Application deleted successfully')
    return
  } catch (error) {
    sendErrorResponse(
      res,
      { message: 'Error deleting application', error },
      500,
    )
    return
  }
}

// Function to list all job IDs for applications made by a specific applicant
export const listJobIdsForApplicant = async (req: Request, res: Response) => {
  try {
    const applicantId = req.user?.applicantId // Assuming applicant is authenticated

    // Find applications and select only the jobId field
    const applications = await JobApplication.find({ applicantId }).select(
      'jobId',
    )

    // Map over the applications to extract the job IDs
    const jobIds = applications.map((application) => application.jobId)

    sendSuccessResponse(res, jobIds)
    return
  } catch (error) {
    sendErrorResponse(
      res,
      { message: 'Error listing job IDs for applicant', error },
      500,
    )
    return
  }
}
