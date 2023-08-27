import express from 'express'
import { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, fetchAllOrders } from '../controller/Order.js';

const router = express.Router();

router.post('/', createOrder)
    .delete('/:id', deleteOrder)
    .patch('/:id', updateOrder)
    .get('/', fetchOrdersByUser)


export default router