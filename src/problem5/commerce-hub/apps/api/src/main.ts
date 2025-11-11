import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { StatusCodes } from 'http-status-codes'
import { env } from './configs/environment'
import { logger } from './infrastructure/logging/logger'
import { errorHandler } from './presentation/middlewares/error-handler'
import { generalLimiter } from './presentation/middlewares/rate-limiter'
import { requestLogger } from './presentation/middlewares/request-logger'
import { productRoutes } from './presentation/routes/product-routes'

const host = env.HOST
const port = env.PORT

const app = express()

// Middlewares
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(requestLogger)

app.use('/api', generalLimiter)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', productRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: StatusCodes.OK, timestamp: new Date().toISOString() })
})

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' })
})

app.use(errorHandler)

app.listen(port, host, () => {
  logger.info(`🚀 Server is running on port ${port}`)
  logger.info(`📡 API: http://${host}:${port}/api`)
})
