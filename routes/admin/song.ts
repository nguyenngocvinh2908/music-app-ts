import { Router } from 'express'
import * as controller from '../../controllers/admin/song'

const router: Router = Router()

router.get('/', controller.index)

export const SongRouter: Router = router