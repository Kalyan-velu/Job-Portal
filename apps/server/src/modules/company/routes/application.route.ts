import { authorizeRole } from '../../../middlewares/auth.middleware'
import {
  GetAllApplications,
  getApplicantDetailsByApplication,
  updateApplicationStatus,
} from '../controllers/application.controller'
import { Router } from 'express'

const employerApplication = Router()

employerApplication
  .get('/applications', GetAllApplications)
  .get(
    '/applications/applicant/:applicationId',
    authorizeRole('employer'),
    getApplicantDetailsByApplication,
  )
  .put(
    '/applications/:applicationId',
    authorizeRole('employer'),
    updateApplicationStatus,
  )

export default employerApplication
