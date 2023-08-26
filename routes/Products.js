import express from 'express'
import { createProduct, fetchAllProducts, fetchProductsByID, updateProduct } from '../controller/Product.js'


const router = express.Router()

router.post('/', createProduct)
      .get('/', fetchAllProducts)
      .get('/:id', fetchProductsByID)
      .patch('/:id', updateProduct)

export default router 