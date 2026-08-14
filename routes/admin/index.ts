import { systemConfig } from './../../config/config';
import { Express } from 'express'
import { DashboardRouter }  from './dashboard'
import { TopicRouter } from './topic';
import { SongRouter } from './song'


const adminRoutes = (app: Express): void => {

  const PATCH_ADMIN = `${systemConfig.prefixAdmin}`
  
  app.use(`/${PATCH_ADMIN}/dashboard`, DashboardRouter)

  app.use(`/${PATCH_ADMIN}/topics`, TopicRouter)

  app.use(`/${PATCH_ADMIN}/songs`, SongRouter)

}

export default adminRoutes