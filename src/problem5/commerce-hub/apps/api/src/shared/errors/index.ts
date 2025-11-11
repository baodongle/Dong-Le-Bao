import { StatusCodes } from 'http-status-codes'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public isOperational = true,
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(StatusCodes.NOT_FOUND, message)
  }
}
