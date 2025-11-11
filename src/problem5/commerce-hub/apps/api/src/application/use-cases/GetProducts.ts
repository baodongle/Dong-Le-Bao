import type { Product, ProductFilters } from '../../domain/entities/Product'
import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import type { PaginatedResult } from '../../shared/types'

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    filters: ProductFilters,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResult<Product>> {
    if (page < 1) {
      page = 1
    }
    if (limit < 1 || limit > 100) {
      limit = 10
    }

    return await this.productRepository.findAll(filters, { page, limit })
  }
}
