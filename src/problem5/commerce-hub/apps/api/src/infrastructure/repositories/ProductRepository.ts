import { and, count, eq, gte, ilike, isNull, lte, or, sql } from 'drizzle-orm'
import type {
  CreateProductDTO,
  Product,
  ProductFilters,
  UpdateProductDTO,
} from '../../domain/entities/Product'
import type { IProductRepository } from '../../domain/repositories/IProductRepository'
import { products } from '../../shared/database/schema'
import type { PaginatedResult, PaginationParams } from '../../shared/types'
import { db } from '../database/connection'

export class ProductRepository implements IProductRepository {
  async create(data: CreateProductDTO): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        name: data.name,
        description: data.description || null,
        price: data.price,
        category: data.category || null,
        stock: data.stock || 0,
      })
      .returning()

    return this.mapToEntity(product)
  }

  async findAll(
    filters: ProductFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>> {
    const conditions = [isNull(products.deletedAt)]

    // Apply filters
    if (filters.category) {
      conditions.push(eq(products.category, filters.category))
    }

    if (filters.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()))
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()))
    }

    if (filters.inStock) {
      conditions.push(sql`${products.stock} > 0`)
    }

    if (filters.search) {
      conditions.push(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`),
        )!,
      )
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(products)
      .where(and(...conditions))

    // Get paginated data
    const offset = (pagination.page - 1) * pagination.limit
    const items = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .limit(pagination.limit)
      .offset(offset)
      .orderBy(products.createdAt)

    return {
      data: items.map((item) => this.mapToEntity(item)),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    }
  }

  async findById(id: string): Promise<Product | null> {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1)

    return product ? this.mapToEntity(product) : null // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | null> {
    const [product] = await db
      .update(products)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning()

    return product ? this.mapToEntity(product) : null // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  }

  async delete(id: string): Promise<boolean> {
    const [product] = await db
      .update(products)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .returning()

    return Boolean(product)
  }

  private mapToEntity(row: Product): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      stock: row.stock,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
    }
  }
}
