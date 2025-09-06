import { validateRequestBody } from '../../../common/request'
import {
  Create,
  GetMyCompanyById,
  GetMyCompanyProfiles,
  Update,
} from '../controllers/profile.controller'
import { CompanySchema } from '../../../zod/company.schema'
import { Router } from 'express'

const companyProfileRouter = Router()

companyProfileRouter
  .post('/create', validateRequestBody(CompanySchema), Create)
  .put('/my', validateRequestBody(CompanySchema), Update)
  .get('/my', GetMyCompanyProfiles)
  .get('/my/:companyId', GetMyCompanyById)

export default companyProfileRouter
