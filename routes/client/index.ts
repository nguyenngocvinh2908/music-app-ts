import { Express } from 'express'
import { TopicRouter } from './topic'
import { SongRouter} from './song'

const clientRoutes = (app: Express): void => {

  app.use('/topics', TopicRouter)

  app.use('/songs', SongRouter)
}

export default clientRoutes
