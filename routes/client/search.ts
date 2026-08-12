import { Router } from 'express'
import * as controller from '../../controllers/client/search'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.get('/:type', controller.index)


export const SearchRouter: Router = router