import ErrorResponse from '../utils/error-response'
import { Response, Request, NextFunction, Errback } from 'express'

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)
  let message = err.message,
    statusCode = err.status === 200 ? 500 : err.status
  const error: any = new ErrorResponse(
    statusCode || 500,
    message || 'Something went wrong on the server side.'
  )
  res.status(error.status).json({ success: false, message: error.message })
}

export default errorHandler
