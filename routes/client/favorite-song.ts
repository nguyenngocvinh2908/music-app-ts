import { favourite } from './../../controllers/client/song';
import { Router } from 'express'
import * as controller from '../../controllers/client/favorite-song'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.get('/', controller.index)

export const FavoriteSongRouter: Router = router