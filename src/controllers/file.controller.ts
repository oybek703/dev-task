import { Request, Response } from 'express'
import asyncMiddleware from '../utils/async'
import ErrorResponse from '../utils/error-response'
import { File } from '../entities/file.entity'
import { dataSource } from '../config/db.config'
import { getFileExtension } from '../utils/files'
import { join } from 'path'
import { unlink } from 'fs/promises'

// @desc Upload file
// @route /file/upload
// access Private
export const uploadFile = asyncMiddleware(
  async (req: Request, res: Response) => {
    const file = req.file
    if (!file) throw new ErrorResponse(400, 'Field file is required!')
    const { filename, size, mimetype } = file
    const fileExtension = getFileExtension(file)
    const fileRepository = dataSource.getRepository(File)
    const fileEntity = new File()
    fileEntity.name = filename
    fileEntity.size = size
    fileEntity.extension = fileExtension
    fileEntity.mime_type = mimetype
    fileEntity.upload_time = new Date()
    await fileRepository.save(fileEntity)
    res.status(200).json({ success: true, message: 'Uploaded successfully!' })
  }
)

// @desc Get file info
// @route /file/:id
// access Private
export const getFileInfo = asyncMiddleware(
  async (req: Request, res: Response) => {
    const fileId = Number(req.params.fileId)
    const fileRepository = dataSource.getRepository(File)
    const fileEntity = await fileRepository.findOne({
      where: { id: Number(fileId) }
    })
    if (!fileEntity) throw new ErrorResponse(404, 'File not found!')
    res.status(200).json({ success: true, file: fileEntity })
  }
)

// @desc Get file
// @route /file/download/:id
// access Private
export const sendFile = asyncMiddleware(async (req: Request, res: Response) => {
  const fileId = Number(req.params.fileId)
  const fileRepository = dataSource.getRepository(File)
  const fileEntity = await fileRepository.findOne({
    where: { id: fileId }
  })
  if (!fileEntity) throw new ErrorResponse(404, 'File not found!')
  const filePath = join(`${process.cwd()}/uploads/${fileEntity.name}`)
  res.sendFile(filePath)
})

// @desc Delete file
// @route /file/delete/:fileId
// access Private
export const deleteFile = asyncMiddleware(
  async (req: Request, res: Response) => {
    const fileId = Number(req.params.fileId)
    const fileRepository = dataSource.getRepository(File)
    const fileEntity = await fileRepository.findOne({ where: { id: fileId } })
    if (!fileEntity) throw new ErrorResponse(404, 'File not found!')
    const filePath = join(`${process.cwd()}/uploads/${fileEntity.name}`)
    await unlink(filePath)
    await fileRepository.delete({ id: fileId })
    res
      .status(200)
      .json({ success: true, message: 'File deleted successfully!' })
  }
)

// @desc Update file
// @route /file/update/:fileId
// access Private
export const updateFile = asyncMiddleware(
  async (req: Request, res: Response) => {
    const file = req.file
    if (!file) throw new ErrorResponse(400, 'Field file is required!')
    const fileId = Number(req.params.fileId)
    const fileRepository = dataSource.getRepository(File)
    const fileEntity = await fileRepository.findOne({ where: { id: fileId } })
    if (!fileEntity) throw new ErrorResponse(404, 'File not found!')
    const filePath = join(`${process.cwd()}/uploads/${fileEntity.name}`)
    await unlink(filePath)
    const { filename, size, mimetype } = file
    const fileExtension = getFileExtension(file)
    fileEntity.name = filename
    fileEntity.size = size
    fileEntity.mime_type = mimetype
    fileEntity.extension = fileExtension
    fileEntity.upload_time = new Date()
    await fileRepository.save(fileEntity)
    res
      .status(200)
      .json({ success: true, message: 'File updated successfully!' })
  }
)

// @desc Get files
// @route /file/list
// access Private
export const getFiles = asyncMiddleware(async (req: Request, res: Response) => {
  const listSize = Number(req.query.list_size) || 10
  const page = Number(req.query.page) || 1
  const skip = (page - 1) * listSize
  const files = await dataSource
    .getRepository(File)
    .findAndCount({ skip, take: listSize })
  res.status(200).json({ success: true, files })
})
