import {
  deleteApplication,
  getApplicationById,
  listApplicationsForApplicant,
  listJobIdsForApplicant,
  submitApplication,
} from '@server/modules/applicants/controllers/application.controller'
import { Router } from 'express'

const applicantionRouter = Router()

applicantionRouter
  .post('/apply', submitApplication)
  .get('/:applicationId', getApplicationById)
  .get('/l/applied', listApplicationsForApplicant)
  .get('/list/ids/applied', listJobIdsForApplicant)
  .delete('/:applicationId', deleteApplication)

export { applicantionRouter }
