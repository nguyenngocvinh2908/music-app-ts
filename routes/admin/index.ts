import { systemConfig } from './../../config/config';
import { Express } from 'express'
import { DashboardRouter }  from './dashboard'


const adminRoutes = (app: Express): void => {

  const PATCH_ADMIN = `${systemConfig.prefixAdmin}`
  
  app.use(`/${PATCH_ADMIN}/dashboard`, DashboardRouter)

}

export default adminRoutes