import { Express } from 'express'
import { TopicRouter } from './topic'

const clientRoutes = (app: Express): void => {

  app.use('/topics', TopicRouter)
}

export default clientRoutes
