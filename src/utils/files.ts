import { extname } from 'path'

export const getFileExtension = (file: Express.Multer.File) => {
  const { originalname } = file
  const fileExtension = extname(originalname)
  return fileExtension || '.txt'
}
