import multer from 'multer'
import { Request } from 'express'
import { getFileExtension } from '../utils/files'

const storage = multer.diskStorage({
  destination: 'uploads',
  filename(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ) {
    const fileExtension = getFileExtension(file)
    const filename = `${Date.now()}${fileExtension}`
    callback(null, filename)
  }
})

export const upload = multer({ storage })
