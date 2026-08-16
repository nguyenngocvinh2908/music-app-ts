import { Router } from 'express'
import * as controller from '../../controllers/admin/song'
import { uploadSongFilesToCloud } from '../../middlewares/admin/uploadCloud'


const router: Router = Router()
router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', uploadSongFilesToCloud,  controller.createPost)

export const SongRouter: Router = router