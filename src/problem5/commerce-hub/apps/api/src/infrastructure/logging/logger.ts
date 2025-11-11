/* eslint-disable @typescript-eslint/no-explicit-any */
import { pino } from 'pino'

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
})

export const logInfo = (message: string, data?: any) => {
  logger.info(data || {}, message)
}

export const logError = (message: string, error?: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  logger.error({ error: error?.message, stack: error?.stack }, message)
}

export const logWarn = (message: string, data?: any) => {
  logger.warn(data || {}, message)
}

export const logDebug = (message: string, data?: any) => {
  logger.debug(data || {}, message)
}
