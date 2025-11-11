import { StatusCodes } from 'http-status-codes'
import type { Product, UpdateProductDTO } from '../../domain/entities/Product'
import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import { AppError, NotFoundError } from '../../shared/errors'

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, data: UpdateProductDTO): Promise<Product> {
    const parsedPrice = data.price ? parseFloat(data.price) : null

    if (parsedPrice !== null && (isNaN(parsedPrice) || parsedPrice <= 0)) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Price must be a valid number greater than 0',
      )
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Quantity in stock cannot be negative',
      )
    }

    const product = await this.productRepository.update(id, data)

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    return product
  }
}
