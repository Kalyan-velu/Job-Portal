import { getJobsForApplicant } from '@server/modules/job/controllers/job.controller'
import { Router } from 'express'

const publicJobRouter = Router()

publicJobRouter.get('/', getJobsForApplicant)

export { publicJobRouter }
