import { Router } from 'express'
import * as controller from '../../controllers/admin/topic'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create', controller.createPost)

router.get('/edit/:idTopic', controller.edit)

router.patch('/edit/:idTopic', controller.editPatch)

export const TopicRouter: Router = router