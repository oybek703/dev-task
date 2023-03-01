import { Request, Response } from 'express'
import asyncMiddleware from '../utils/async'
import { decode, JwtPayload, verify } from 'jsonwebtoken'
import ErrorResponse from '../utils/error-response'
import { dataSource } from '../config/db.config'
import { Token } from '../entities/token.entity'

// @desc Get user info
// @route /info
// access Private
export const userInfo = asyncMiddleware(async (req: Request, res: Response) => {
  const [_, token] = req.headers.authorization!.split(' ')
  const { id } = (await decode(token)) as JwtPayload
  res.status(201).json({ success: true, id })
})

// @desc Logout user
// @route /logout
// access Private
export const logout = asyncMiddleware(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw new ErrorResponse(400, 'Invalid refresh token!')
  const { id } = (await verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_KEY!
  )) as JwtPayload
  const userRefreshToken = await dataSource
    .getRepository(Token)
    .findOne({ where: { user_id: id } })
  if (userRefreshToken)
    await dataSource.getRepository(Token).delete({ id: userRefreshToken.id })
  res.status(200).json({ success: true, message: 'Logged out successfully!' })
})
