import { validateRequestBody } from '../../../common/request'
import { authorizeRole } from '../../../middlewares/auth.middleware'
import {
  CompleteApplicantProfile,
  getApplicantProfile,
} from '../controllers/profile.controller'
import { ApplicantSchema } from '../../../zod/applicant.schema'
import { Router } from 'express'

const applicantRouter = Router()

applicantRouter
  .post(
    '/update',
    authorizeRole('applicant'),
    validateRequestBody(ApplicantSchema),
    CompleteApplicantProfile,
  )
  .get('/', getApplicantProfile)
export default applicantRouter
