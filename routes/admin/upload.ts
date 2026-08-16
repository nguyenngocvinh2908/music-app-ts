import { Router } from 'express'
import { uploadSingle } from '../../middlewares/admin/uploadCloud'
import * as controller from '../../controllers/admin/upload'

const router: Router = Router() // Tạo 1 đối tượng router để quản lý độc lập

router.post('/', uploadSingle('file', 'tinymce/images', 'image'), controller.index)

export const UploadRouter: Router = router  