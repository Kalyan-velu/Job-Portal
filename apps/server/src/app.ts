import 'dotenv/config'
import express from 'express'
import { middleware } from './common/middleware.config'
import RouterConfigure from './common/routes.config'
import { Applicant, ApplicantApplication } from './modules/applicants'
import CompanyModule from './modules/company'
import userModules from './modules/user'

import database from './common/database.config'
import { PrivateJobModule, PublicJobModule } from './modules/job'
import path from 'node:path'

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

if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, '../../web/dist')))

  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, "../../web", "dist", "index.html"))
  })
} else {
  app.get("/", (request, response) => {
    response.json({message: "Server is Up"});
  });
}


export default app
