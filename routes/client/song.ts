import { Router } from 'express'
import * as controller from '../../controllers/client/song'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.get('/:slugTopic', controller.songsOfTopic)

router.get('/detail/:slugSong', controller.songDetail)

router.patch('/like/:typeLike/:idSong', controller.likeSong)


export const SongRouter: Router = router