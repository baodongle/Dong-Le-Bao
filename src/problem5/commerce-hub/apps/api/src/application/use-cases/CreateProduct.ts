import { StatusCodes } from 'http-status-codes'
import type { CreateProductDTO, Product } from '../../domain/entities/Product'
import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import { AppError } from '../../shared/errors'

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    // Business logic validation
    const priceValue =
      typeof data.price === 'string' ? parseFloat(data.price) : data.price

    if (isNaN(priceValue) || priceValue <= 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Price must be a valid number greater than 0',
      )
    }

    if (data.stock && data.stock < 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Quantity in stock cannot be negative',
      )
    }

    return await this.productRepository.create(data)
  }
}
