import 'dotenv/config'
import express from 'express'
import Middleware from './common/middleware.conf'
import RouterConfigure from './common/routes.config'
import { Applicant, ApplicantApplication } from './modules/applicants'
import CompanyModule from './modules/company'
import userModules from './modules/user'

import path from 'node:path'
import { Database } from './common/database.config'
import { PrivateJobModule, PublicJobModule } from './modules/job'

const app = express()

const middleware = new Middleware(app)
const configApi = new RouterConfigure(app, middleware)
new Database()

configApi
  .configureRoutes([
    Applicant,
    ApplicantApplication,
    userModules.Auth,
    userModules.User,
    PrivateJobModule,
    PublicJobModule,
    CompanyModule,
  ])
  .then(() => {
    console.info('All Modules have been implemented.')
  })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../web/dist')))

  // serve index.html for all routes except api
  app.get(/^(?!\/api)/, (request, response) => {
    response.sendFile(
      path.resolve(__dirname, '../../web', 'dist', 'index.html'),
    )
  })
} else {
  app.get('/', (request, response) => {
    response.json({ message: 'Server is Up' })
  })
}

export default app
