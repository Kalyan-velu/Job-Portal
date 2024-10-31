import 'dotenv/config'
import express from 'express'

import { middleware } from '@server/common/middleware.config'
import RouterConfigure from '@server/common/routes.config'
import { Applicant, ApplicantApplication } from '@server/modules/applicants'
import CompanyModule from '@server/modules/company'
import userModules from '@server/modules/user'

import database from '@server/common/database.config'
import { PrivateJobModule, PublicJobModule } from '@server/modules/job'

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
