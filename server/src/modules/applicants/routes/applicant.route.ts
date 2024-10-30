import { validateRequestBody } from '@server/common/request'
import { authorizeRole } from '@server/middlewares/auth.middleware'
import { CompleteApplicantProfile } from '@server/modules/applicants/controllers/profile.controller'
import { ApplicantSchema } from '@server/zod/applicant.schema'
import { Router } from 'express'

const applicantRouter = Router()

applicantRouter.post(
  '/update',
  authorizeRole('applicant'),
  validateRequestBody(ApplicantSchema),
  CompleteApplicantProfile,
)

export default applicantRouter
