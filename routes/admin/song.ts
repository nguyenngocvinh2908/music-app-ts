import { Router } from 'express'
import * as controller from '../../controllers/admin/song'
import { uploadSingleImageToCloud } from '../../middlewares/admin/uploadCloud'


const router: Router = Router()
router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', uploadSingleImageToCloud,  controller.createPost)

export const SongRouter: Router = router