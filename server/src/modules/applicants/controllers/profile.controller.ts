import { sendErrorResponse, sendSuccessResponse } from '@server/common/response'
import { Applicant } from '@server/models/applicant.model'
import { User } from '@server/models/user.model'
import type { Applicant as ApplicantI } from '@server/zod/applicant.schema'
import { Request, Response } from 'express'

interface ApplicantUpdateReq extends Request {
  body: ApplicantI
}

interface ApplicantUpdateReq extends Request {
  body: ApplicantI
}

export const CompleteApplicantProfile = async (
  req: ApplicantUpdateReq,
  res: Response,
) => {
  try {
    const data = req.body
    const existingApplicant = await Applicant.findOne({ userId: req.user.id })

    if (existingApplicant) {
      // Update existing applicant profile
      Object.assign(existingApplicant, data)
      await existingApplicant.save()

      sendSuccessResponse(
        res,
        existingApplicant,
        'Applicant profile updated successfully',
      )
      return
    }

    // Create new applicant profile if none exists
    const newApplicant = new Applicant({
      ...data,
      name: req.user.name,
      email: req.user.email,
      userId: req.user.id,
    })
    await newApplicant.save()

    // Update user record with new applicant ID
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { applicantId: newApplicant._id },
      { new: true },
    )

    await user.save()
    sendSuccessResponse(
      res,
      newApplicant,
      'Applicant profile created successfully',
    )
    return
  } catch (error) {
    console.error('Error in CompleteApplicantProfile:', error)
    sendErrorResponse(
      res,
      'An error occurred while completing the profile',
      500,
    )
    return
  }
}

export const getApplicantProfile = async (req: Request, res: Response) => {
  try {
    const applicant = await Applicant.findOne({ userId: req.user.id }).select(
      'phone resumeLink education skills coverLetter linkedin experiences',
    )

    if (!applicant && req.user.applicantId) {
      sendErrorResponse(res, 'Applicant profile not found', 404)
      return
    }

    // Transform the response to match the default form values for Applicant type
    const formattedData = {
      phone: applicant?.phone ?? '',
      resumeLink: applicant?.resumeLink ?? '',
      education:
        applicant?.education?.map((edu) => ({
          degree: edu?.degree ?? '',
          institution: edu?.institution ?? '',
          startDate: edu?.startDate?.toISOString().split('T')[0],
          endDate: edu?.endDate?.toISOString().split('T')[0],
          description: edu?.description ?? '', // Optional field
        })) ?? [],
      skills:
        applicant?.skills?.map((skill) => ({
          name: skill?.name ?? '',
          description: skill?.description ?? '',
        })) ?? [],
      coverLetter: applicant?.coverLetter ?? '',
      linkedin: applicant?.linkedin ?? '',
      experiences:
        applicant?.experiences?.map((exp) => ({
          title: exp?.title ?? '',
          company: exp?.company ?? '',
          location: exp?.location ?? '',
          startDate: exp?.startDate.toISOString().split('T')[0],
          endDate: exp?.endDate.toISOString().split('T')[0],
          description: exp?.description ?? '', // Optional field
        })) ?? [],
    }

    sendSuccessResponse(
      res,
      formattedData,
      'Applicant profile retrieved successfully',
    )
    return
  } catch (error) {
    console.error('Error fetching applicant profile:', error)
    sendErrorResponse(res, 'Error retrieving applicant profile', 500)
    return
  }
}
