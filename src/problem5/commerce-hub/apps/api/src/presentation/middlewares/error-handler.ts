import type { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'
import { fromError } from 'zod-validation-error'
import { logger } from '../../infrastructure/logging/logger'
import { AppError } from '../../shared/errors'

/**
 * Global Error Handler Middleware.
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Default error values
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  let message: string = ReasonPhrases.INTERNAL_SERVER_ERROR
  let isOperational = false

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST
    message = fromError(err).message
    isOperational = true

    // Log validation errors as warnings
    logger.warn(
      {
        type: 'validation_error',
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        errors: err.issues,
      },
      'Validation error occurred',
    )
  }
  // Handle custom AppError
  else if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    isOperational = err.isOperational

    // Log operational errors based on severity
    if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
      logger.error(
        {
          type: 'operational_error',
          statusCode,
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
          message: err.message,
          stack: err.stack,
        },
        'Operational error occurred',
      )
    } else {
      logger.warn(
        {
          type: 'operational_error',
          statusCode,
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
          message: err.message,
        },
        'Client error occurred',
      )
    }
  }
  // Handle unexpected errors
  else {
    logger.error(
      {
        type: 'unexpected_error',
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
      '🔥 Unexpected error occurred',
    )
  }

  // Additional detailed logging for non-operational errors or development
  if (!isOperational || process.env.NODE_ENV === 'development') {
    logger.debug(
      {
        errorDetails: {
          message: err.message,
          stack: err.stack,
          url: req.originalUrl,
          method: req.method,
          body: req.body,
          params: req.params,
          query: req.query,
        },
      },
      'Detailed error information',
    )
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err,
      }),
    },
  })
}
