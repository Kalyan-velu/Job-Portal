import { sendErrorResponse, sendSuccessResponse } from '@server/common/response'
import { Applicant } from '@server/models/applicant.model'
import { User } from '@server/models/user.model'
import type { Applicant as ApplicantI } from '@server/zod/applicant.schema'
import { Request, Response } from 'express'

interface ApplicantUpdateReq extends Request {
  body: ApplicantI
}

export const CompleteApplicantProfile = async (
  req: ApplicantUpdateReq,
  res: Response,
) => {
  try {
    const data = req.body
    const existingApplicant = await Applicant.findOne({
      $or: [{ userId: req.user.id }],
    })
    if (existingApplicant) {
      // if (existingApplicant.userId.toString() === req.user.id) {
      return sendErrorResponse(
        res,
        'You have already completed your profile, please update your existing details if needed.',
        409,
      )
      // }
    }
    const newApplicant = new Applicant({
      ...data,
      userId: req.user.id,
    })
    await newApplicant.save()
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        applicantId: newApplicant._id,
      },
      { new: true }, // This will return the updated user document
    )

    await user.save()
    sendSuccessResponse(res, newApplicant, 'Success')
    return
  } catch (e) {
    console.error('ℹ️ ~ file: profile.controller.ts:22 ~ e:', e)
    sendErrorResponse(res, e, 500)
    return
  }
}
