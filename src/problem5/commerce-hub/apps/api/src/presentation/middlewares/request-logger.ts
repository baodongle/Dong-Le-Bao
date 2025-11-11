import type { RequestHandler } from 'express'
import { logger } from '../../infrastructure/logging/logger'

export const requestLogger: RequestHandler = (req, res, next) => {
  const startTime = Date.now()

  // Log request
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })

  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - startTime

    logger.info({
      type: 'response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    })
  })

  next()
}
