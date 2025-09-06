import { sendErrorResponse, sendSuccessResponse } from '../../../common/response'
import { Applicant } from '../../../models/applicant.model'
import { JobApplication } from '../../../models/application.model'
import { Company } from '../../../models/company.model'
import { Job } from '../../../models/job.model'
import type { Request, Response } from 'express'
import mongoose from 'mongoose'

export const GetAllApplications = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId

    // Check if the user has a companyId associated
    if (!companyId) {
      return sendErrorResponse(res, 'Company not found for this user', 404)
    }

    // Fetch applications for the user's company
    const applications = await JobApplication.find({
      companyId,
    })
      .populate('jobId', 'title') // Populate job title for each application
      .populate('applicantId', 'name email') // Populate applicant details (optional)
      .select('jobId applicantId applicationStatus appliedAt')

    // Send successful response with applications data
    sendSuccessResponse(
      res,
      applications,
      'Applications retrieved successfully',
    )
    return
  } catch (e) {
    console.error('Error fetching applications:', e)
    sendErrorResponse(res, 'Error retrieving applications', 500)
    return
  }
}
export const getApplicantDetailsByApplication = async (
  req: Request,
  res: Response,
) => {
  const { applicationId } = req.params
  const companyId = req.user?.companyId // assuming middleware for employer authentication
  console.debug(
    'ℹ️ ~ file: application.controller.ts:46 ~ companyId:',
    companyId,
  )

  // Validate applicationId format
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    res.status(400).json({ error: 'Invalid application ID format' })
    return
  }

  try {
    // Find the job application and populate job and applicant details
    const application = await JobApplication.findById(applicationId)
      .populate({
        path: 'applicantId',
        model: Applicant,
        select:
          'name email phone resumeLink linkedin skills experiences education',
      })
      .populate({
        path: 'jobId',
        model: Job,
        select: 'title',
      })
      .populate({
        path: 'companyId',
        model: Company,
        select: 'title',
      })
    console.debug(
      'ℹ️ ~ file: application.controller.ts:55 ~ application:',
      application,
    )

    // Ensure the application exists and belongs to the employer
    if (
      !application ||
      application.companyId._id.toString() !== companyId.toString()
    ) {
      res.status(404).json({ error: 'Application not found or access denied' })
      return
    }

    // Format the response to the desired structure
    const applicantDetails = {
      contactInfo: {
        //@ts-expect-error Type casting issue
        phone: application.applicantId.phone,
        //@ts-expect-error Type casting issue
        email: application.applicantId.email,
      },
      //@ts-expect-error Type  casting issue
      linkedinProfile: application.applicantId.linkedin || null,
      //@ts-expect-error Type  casting issue
      resumeLink: application.applicantId.resumeLink || null,
      coverLetter: application.coverLetter || null,
      //@ts-expect-error Type  casting issue
      education: application.applicantId.education.map((edu: any) => ({
        degree: edu.degree,
        institution: edu.institution,
        startDate: edu.startDate,
        endDate: edu.endDate || null,
        description: edu.description || null,
      })),
      //@ts-expect-error Type  casting issue
      skills: application.applicantId.skills.map((skill: any) => ({
        name: skill.name,
        description: skill.description || null,
      })),
      //@ts-expect-error Type  casting issue
      experiences: application.applicantId.experiences.map((exp: any) => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate || null,
        description: exp.description || null,
      })),
      jobApplication: {
        //@ts-expect-error Type casting issue
        jobTitle: application.jobId.title,
        applicationStatus: application.applicationStatus,
        appliedAt: application.appliedAt,
      },
    }

    sendSuccessResponse(res, applicantDetails)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error, please try again later.' })
    return
  }
}

interface UpdateReq extends Request {
  body: {
    newStatus?:
      | 'submitted'
      | 'under review'
      | 'interview scheduled'
      | 'offer extended'
      | 'rejected'
    note?: string
  }
}

interface UpdateToScheduleReq extends UpdateReq {
  body: {
    newStatus: 'interview scheduled'
    note: string
  }
}

export const updateApplicationStatus = async (
  req: UpdateReq | UpdateToScheduleReq,
  res: Response,
) => {
  const applicationId = req.params.applicationId
  const newStatus = req.body?.newStatus
  const note = req.body.note
  if (!applicationId || !newStatus) {
    res
      .status(400)
      .json({ message: 'Application ID and new status are required.' })
    return
  }
  if (newStatus === 'interview scheduled' && !note) {
    sendErrorResponse(
      res,
      'A note describing the process after scheduling the interview must be provided.',
      400,
    )
    return
  }

  try {
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      { applicationStatus: newStatus, note },
      { new: true }, // Return the updated document
    )

    if (!updatedApplication) {
      sendErrorResponse(res, 'Application not found.')
      return
    }
    await updatedApplication.save()
    sendSuccessResponse(
      res,
      updatedApplication,
      'Application updated successfully.',
    )
    return
  } catch (error) {
    console.error('Error updating application status:', error)
    sendErrorResponse(res, 'Something went wrong', 500)
    return
  }
}
