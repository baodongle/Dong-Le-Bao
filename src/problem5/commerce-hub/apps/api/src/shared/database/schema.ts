import { isNull, sql } from 'drizzle-orm'
import {
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const products = pgTable(
  'products',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    category: varchar('category', { length: 100 }),
    stock: integer('stock').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => {
    return [
      index('idx_products_category').on(table.category),
      index('idx_products_created_at').on(table.createdAt),
      index('idx_products_not_deleted')
        .on(table.deletedAt)
        .where(isNull(table.deletedAt)),
    ]
  },
)
