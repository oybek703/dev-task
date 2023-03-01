import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import { config } from 'dotenv'
import { File } from '../entities/file.entity'
import { Token } from '../entities/token.entity'

config()

export const dataSource = new DataSource({
  type: 'mysql',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [User, File, Token],
  synchronize: process.env.NODE_ENV === 'development'
})

export async function connectToDB() {
  try {
    await dataSource.initialize()
    console.log('Successfully connected to database!')
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(`Error while connecting to database: ${e.message}`)
    }
    console.log(e)
  }
}
