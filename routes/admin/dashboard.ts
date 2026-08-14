import { Router } from 'express'
import * as controller from '../../controllers/admin/dashboard'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.get('/', controller.index)

export const DashboardRouter: Router = router