import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import { NotFoundError } from '../../shared/errors'

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.productRepository.delete(id)

    if (!deleted) {
      throw new NotFoundError('Product not found')
    }
  }
}
