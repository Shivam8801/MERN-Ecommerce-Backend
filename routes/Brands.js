import express from 'express'
import { fetchBrands, createBrand } from '../controller/Brand.js'


const router = express.Router()

router.get('/', fetchBrands)
    .post('/', createBrand)

export default router 