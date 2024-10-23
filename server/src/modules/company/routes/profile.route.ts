import { validateRequestBody } from '@/common/request';
import {
  Create,
  GetMyCompanyById,
  GetMyCompanyProfiles,
  Update,
} from '@/modules/company/controllers/profile.controller';
import { CompanySchema } from '@/zod-schema/company.schema';
import { Router } from 'express';

const companyProfileRouter = Router();

companyProfileRouter
  .post('/create', validateRequestBody(CompanySchema), Create)
  .post('/update/:companyId', validateRequestBody(CompanySchema), Update)
  .get('/my', GetMyCompanyProfiles)
  .get('/my/:companyId', GetMyCompanyById);

export default companyProfileRouter;
