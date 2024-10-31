import { validateRequestBody } from '@server/common/request'
import {
  Create,
  GetMyCompanyById,
  GetMyCompanyProfiles,
  Update,
} from '@server/modules/company/controllers/profile.controller'
import { CompanySchema } from '@server/zod-schema/company.schema'
import { Router } from 'express'

const companyProfileRouter = Router()

companyProfileRouter
  .post('/create', validateRequestBody(CompanySchema), Create)
  .put('/my', validateRequestBody(CompanySchema), Update)
  .get('/my', GetMyCompanyProfiles)
  .get('/my/:companyId', GetMyCompanyById)

export default companyProfileRouter
