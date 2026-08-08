import { Router } from 'express'
import * as controller from '../../controllers/client/topic'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.get('/', controller.topics)

export const TopicRouter: Router = router
