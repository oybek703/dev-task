import { Router } from 'express'
import { auth } from '../middleware/auth.middleware'
import { upload } from '../config/multer.config'
import {
  deleteFile,
  getFileInfo,
  getFiles,
  sendFile,
  updateFile,
  uploadFile
} from '../controllers/file.controller'

const router = Router()

router.post('/file/upload', auth, upload.single('file'), uploadFile)
router.get('/file/list', auth, getFiles)
router.get('/file/download/:fileId', auth, sendFile)
router.delete('/file/delete/:fileId', auth, deleteFile)
router.put('/file/update/:fileId', auth, upload.single('file'), updateFile)
router.get('/file/:fileId', auth, getFileInfo)

export { router as filesRoutes }
