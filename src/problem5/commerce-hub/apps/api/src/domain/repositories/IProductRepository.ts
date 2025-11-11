import type { PaginatedResult, PaginationParams } from '../../shared/types'
import type {
  CreateProductDTO,
  Product,
  ProductFilters,
  UpdateProductDTO,
} from '../entities/Product'

export interface IProductRepository {
  create: (data: CreateProductDTO) => Promise<Product>
  findAll: (
    filters: ProductFilters,
    pagination: PaginationParams,
  ) => Promise<PaginatedResult<Product>>
  findById: (id: string) => Promise<Product | null>
  update: (id: string, data: UpdateProductDTO) => Promise<Product | null>
  delete: (id: string) => Promise<boolean>
}
