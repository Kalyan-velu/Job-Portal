import 'dotenv/config'
import express from 'express'

import { middleware } from './common/middleware.config'
import RouterConfigure from './common/routes.config'
import { Applicant, ApplicantApplication } from './modules/applicants'
import CompanyModule from './modules/company'
import userModules from './modules/user'

import database from './common/database.config'
import { PrivateJobModule, PublicJobModule } from './modules/job'

const app = express()
const configApi = new RouterConfigure(app)

const mongoose = database.connectDB()
middleware.configureMiddleware(app)
middleware.attach({ name: 'mongoose', property: mongoose })

const modules = [
  Applicant,
  ApplicantApplication,
  userModules.Auth,
  userModules.User,
  PrivateJobModule,
  PublicJobModule,
  CompanyModule,
]

for (let module of modules) {
  configApi.configureRoute(module)
}

export default app
