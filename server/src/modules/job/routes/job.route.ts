import { validateRequestBody } from '@server/common/request'
import {
  archiveJob,
  createJob,
  deleteJob,
  getActiveJobs,
  getAllJobs,
  getJobById,
  listArchivedJobs,
  unarchiveJob,
  updateJob,
} from '@server/modules/job/controllers/job.controller'
import { JobSchema } from '@server/zod/job.schema'
import { Router } from 'express'
import z from 'zod'

const jobRouter = Router()
const updateSchema = JobSchema.extend({
  isArchived: z.boolean(),
})
jobRouter
  .post('/create', validateRequestBody(JobSchema), createJob)
  .get('/status/active', getActiveJobs)
  .get('/status/all', getAllJobs)
  .get('/:id', getJobById)
  .put('/:id', validateRequestBody(updateSchema), updateJob)
  .delete('/:id', deleteJob)
  .put('/archive/:jobId', archiveJob)
  .put('/unarchive/:jobId', unarchiveJob)
  .get('/status/archived', listArchivedJobs)

export { jobRouter }
