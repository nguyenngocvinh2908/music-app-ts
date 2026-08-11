import { Express } from 'express'
import { TopicRouter } from './topic'
import { SongRouter} from './song'
import { FavoriteSongRouter } from './favorite-song'

const clientRoutes = (app: Express): void => {

  app.use('/topics', TopicRouter)

  app.use('/songs', SongRouter)

  app.use('/favorite-songs', FavoriteSongRouter)
}

export default clientRoutes
