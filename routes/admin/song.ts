import { Router } from 'express'
import * as controller from '../../controllers/admin/song'
import { uploadFields } from '../../middlewares/admin/uploadCloud'


const router: Router = Router()
router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', uploadFields([
  { name: 'avatar', folder: 'songs/avatars', resourceType: 'image'},
  { name: 'audio', folder: 'songs/audio', resourceType: 'video'}
]),  controller.createPost)

router.get('/edit/:idSong', controller.edit)

router.patch('/edit/:idSong', uploadFields([
  { name: 'avatar', folder: 'songs/avatars', resourceType: 'image'},
  { name: 'audio', folder: 'songs/audio', resourceType: 'video'}
]), controller.editPatch)

export const SongRouter: Router = router