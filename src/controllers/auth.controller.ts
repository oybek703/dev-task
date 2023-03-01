import { Request, Response } from 'express'
import asyncMiddleware from '../utils/async'
import ErrorResponse from '../utils/error-response'
import { dataSource } from '../config/db.config'
import { User } from '../entities/user.entity'
import { compare, genSalt, hash } from 'bcrypt'
import { generateTokens } from '../utils/generate-tokens'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

// @desc Sign up user
// @route /signup
// access Public
export const signUp = asyncMiddleware(async (req: Request, res: Response) => {
  const { id, password } = req.body
  if (!id || !password)
    throw new ErrorResponse(400, 'Id and password required!')
  if (password.length <= 5)
    throw new ErrorResponse(400, 'Password must contain at least 6 characters!')
  const existingUser = await dataSource
    .getRepository(User)
    .exist({ where: { id } })
  if (existingUser) throw new ErrorResponse(400, 'User already exists!')
  const newUser = new User()
  newUser.id = id
  const salt = await genSalt(10)
  newUser.password = await hash(password, salt)
  const { accessToken, refreshToken } = await generateTokens({ id })
  await dataSource.getRepository(User).save(newUser)
  res.status(201).json({ success: true, accessToken, refreshToken })
})

// @desc Sign in user
// @route /signin
// access Public
export const signIn = asyncMiddleware(async (req: Request, res: Response) => {
  const { id, password } = req.body
  const user = await dataSource.getRepository(User).findOne({ where: { id } })
  if (!user) throw new ErrorResponse(400, 'Invalid credentials!')
  const isValidPassword = await compare(password, user.password)
  if (!isValidPassword) throw new ErrorResponse(400, 'Invalid credentials!')
  const { accessToken, refreshToken } = await generateTokens({ id })
  res.status(200).json({ success: true, accessToken, refreshToken })
})

// @desc Update access token
// @route /new_token
// access Private
export const newToken = asyncMiddleware(async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) throw new ErrorResponse(400, 'Invalid refresh token!')
  const { id } = (await verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_KEY!
  )) as JwtPayload
  const newAccessToken = sign({ id }, process.env.JWT_ACCESS_TOKEN_KEY!, {
    expiresIn: '10m'
  })
  res
    .status(200)
    .json({ success: true, accessToken: newAccessToken, refreshToken })
})
