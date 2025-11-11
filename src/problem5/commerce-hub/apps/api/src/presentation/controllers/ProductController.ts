import type { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import type {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductByIdUseCase,
  GetProductsUseCase,
  UpdateProductUseCase,
} from '../../application/use-cases'
import {
  type ProductFilters,
  productInsertSchema,
  productUpdateSchema,
} from '../../domain/entities/Product'
import { logInfo } from '../../infrastructure/logging/logger'

export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductsUseCase: GetProductsUseCase,
    private getProductByIdUseCase: GetProductByIdUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
  ) {}

  create: RequestHandler = async (req, res, next) => {
    try {
      const validatedData = productInsertSchema.parse(req.body)

      logInfo('Creating product', { name: validatedData.name })

      const product = await this.createProductUseCase.execute(validatedData)

      logInfo('Product created successfully', { id: product.id })

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  getAll: RequestHandler = async (req, res, next) => {
    try {
      const filters: ProductFilters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        inStock: req.query.inStock === 'true',
        search: req.query.search as string,
      }
      const page = req.query.page ? Number(req.query.page) : 1
      const limit = req.query.limit ? Number(req.query.limit) : 10
      const result = await this.getProductsUseCase.execute(filters, page, limit)

      logInfo('Products retrieved successfully', req.query)

      res.status(StatusCodes.OK).json({
        success: true,
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }

  getById: RequestHandler = async (req, res, next) => {
    try {
      const product = await this.getProductByIdUseCase.execute(req.params.id)

      logInfo('Product retrieved successfully', { id: req.params.id })

      res.status(StatusCodes.OK).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  update: RequestHandler = async (req, res, next) => {
    try {
      const validatedData = productUpdateSchema.parse(req.body)

      logInfo('Updating product', { name: validatedData.name })

      const product = await this.updateProductUseCase.execute(
        req.params.id,
        validatedData,
      )

      logInfo('Product updated successfully', { id: product.id })

      res.status(StatusCodes.OK).json({
        success: true,
        data: product,
      })
    } catch (error) {
      next(error)
    }
  }

  delete: RequestHandler = async (req, res, next) => {
    try {
      await this.deleteProductUseCase.execute(req.params.id)

      logInfo('Product deleted successfully', { id: req.params.id })

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  }
}
