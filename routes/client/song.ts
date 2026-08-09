import { Router } from 'express'
import * as controller from '../../controllers/client/song'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.get('/:slugTopic', controller.songsOfTopic)

export const SongRouter: Router = router