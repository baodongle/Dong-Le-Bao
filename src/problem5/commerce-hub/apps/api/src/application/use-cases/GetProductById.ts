import type { Product } from '../../domain/entities/Product'
import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import { NotFoundError } from '../../shared/errors'

export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    return product
  }
}
