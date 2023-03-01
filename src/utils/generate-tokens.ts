import { sign } from 'jsonwebtoken'
import { dataSource } from '../config/db.config'
import { Token } from '../entities/token.entity'

export async function generateTokens(payload: { id: string }) {
  const accessToken = sign(payload, process.env.JWT_ACCESS_TOKEN_KEY!, {
    expiresIn: '10m'
  })
  const refreshToken = sign(payload, process.env.JWT_REFRESH_TOKEN_KEY!, {
    expiresIn: '30d'
  })
  const existingRefreshToken = await dataSource.getRepository(Token).exist()
  if (existingRefreshToken)
    await dataSource.getRepository(Token).delete({ user_id: payload.id })
  const newRefreshToken = new Token()
  newRefreshToken.user_id = payload.id
  newRefreshToken.created_at = new Date()
  newRefreshToken.expires_at = new Date(
    new Date().setDate(new Date().getDate() + 30)
  )
  await dataSource.getRepository(Token).save(newRefreshToken)
  return { accessToken, refreshToken }
}
