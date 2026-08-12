import { Express } from 'express'
import { TopicRouter } from './topic'
import { SongRouter} from './song'
import { FavoriteSongRouter } from './favorite-song'
import { SearchRouter } from './search'

const clientRoutes = (app: Express): void => {

  app.use('/topics', TopicRouter)

  app.use('/songs', SongRouter)

  app.use('/favorite-songs', FavoriteSongRouter)

  app.use('/search', SearchRouter)
}

export default clientRoutes
