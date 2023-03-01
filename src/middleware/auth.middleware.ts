import { NextFunction, Request, Response } from 'express'
import ErrorResponse from '../utils/error-response'
import { verify } from 'jsonwebtoken'

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenData = req.headers.authorization?.split(' ')
    if (!tokenData) throw new ErrorResponse(401, 'Unauthorized!')
    const [_, token] = tokenData
    if (!token) throw new ErrorResponse(401, 'Unauthorized!')
    await verify(token, process.env.JWT_ACCESS_TOKEN_KEY!)
    next()
  } catch (e) {
    next(e)
  }
}
