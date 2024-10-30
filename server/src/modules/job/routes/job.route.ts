import { validateRequestBody } from '@server/common/request'
import {
  archiveJob,
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  listArchivedJobs,
  unarchiveJob,
  updateJob,
} from '@server/modules/job/controllers/job.controller'
import { JobSchema } from '@server/zod/job.schema'
import { Router } from 'express'

const jobRouter = Router()

jobRouter
  .post('/create', validateRequestBody(JobSchema), createJob)
  .get('/', getJobs)
  .get('/:id', getJobById)
  .put('/:id', updateJob)
  .delete('/:id', deleteJob)
  .put('/archive/:jobId', archiveJob)
  .put('/unarchive/:jobId', unarchiveJob)
  .get('/status/archived', listArchivedJobs)
export { jobRouter }
