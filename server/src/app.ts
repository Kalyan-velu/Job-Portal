import express from 'express';

import { middleware } from '@/common/middleware.config';
import RouterConfigure from '@/common/routes.config';
import Applicant from '@/modules/applicants';
import CompanyModule from '@/modules/company';
import JobModule from '@/modules/job';
import userModules from '@/modules/user';
import 'dotenv/config';

import database from '@/common/database.config';

const app = express();
const configApi = new RouterConfigure(app);

const mongoose = database.connectDB();
middleware.configureMiddleware(app);
middleware.attach({ name: 'mongoose', property: mongoose });

const modules = [
  Applicant,
  userModules.Auth,
  userModules.User,
  JobModule,
  CompanyModule,
];

for (let module of modules) {
  configApi.configureRoute(module);
}

export default app;
