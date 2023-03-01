import cors from 'cors'
import { config } from 'dotenv'
import express, { json } from 'express'
import { connectToDB } from './config/db.config'
import errorHandler from './middleware/error-handler'
import notFound from './middleware/not-found'
import { authRoutes } from './routes/auth.routes'
import { userRoutes } from './routes/user.routes'
import { filesRoutes } from './routes/files.routes'

// Load env variables
config()

const app = express()

// Make cors allow all origins
app.use(cors())

app.use(json())
app.use(express.static('uploads'))

app.use(authRoutes)
app.use(userRoutes)
app.use(filesRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5001

;(async () => {
  await connectToDB()
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`))
})()
