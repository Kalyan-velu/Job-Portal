import { getJobsForApplicant } from '../controllers/job.controller'
import { Router } from 'express'

const publicJobRouter = Router()

publicJobRouter.get('/', getJobsForApplicant)

export { publicJobRouter }
