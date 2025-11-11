import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { products } from '../../shared/database/schema'

export const productInsertSchema = createInsertSchema(products, {
  price: z.coerce.string(),
})
export const productUpdateSchema = createUpdateSchema(products, {
  price: z.coerce.string().optional(),
})
export type Product = typeof products.$inferSelect
export type CreateProductDTO = z.infer<typeof productInsertSchema>
export type UpdateProductDTO = z.infer<typeof productUpdateSchema>

export interface ProductFilters {
  category?: string
  minPrice?: number | string
  maxPrice?: number | string
  inStock?: boolean
  search?: string
}
