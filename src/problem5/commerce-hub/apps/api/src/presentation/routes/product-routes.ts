import { Router } from 'express'
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetProductByIdUseCase,
  GetProductsUseCase,
  UpdateProductUseCase,
} from '../../application/use-cases'
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository'
import { ProductController } from '../controllers/ProductController'
import { strictLimiter } from '../middlewares/rate-limiter'

const router = Router()

// Dependency Injection
const productRepository = new ProductRepository()
const createProductUseCase = new CreateProductUseCase(productRepository)
const getProductsUseCase = new GetProductsUseCase(productRepository)
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository)
const updateProductUseCase = new UpdateProductUseCase(productRepository)
const deleteProductUseCase = new DeleteProductUseCase(productRepository)
const productController = new ProductController(
  createProductUseCase,
  getProductsUseCase,
  getProductByIdUseCase,
  updateProductUseCase,
  deleteProductUseCase,
)

// Routes
router.post('/products', strictLimiter, productController.create)
router.get('/products', productController.getAll)
router.get('/products/:id', productController.getById)
router.put('/products/:id', strictLimiter, productController.update)
router.delete('/products/:id', strictLimiter, productController.delete)

export const productRoutes: Router = router
