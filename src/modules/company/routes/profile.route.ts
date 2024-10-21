import { Create } from '@/modules/company/controllers/profile.controller';
import { Router } from 'express';

const companyProfileRouter = Router();

companyProfileRouter.post('/create', Create);

export default companyProfileRouter;
