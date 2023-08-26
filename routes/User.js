import express from 'express'
import { fetchUserById, updateUser } from '../controller/User.js'


const router = express.Router()

router.get('/', fetchUserById)
    .patch('/:id', updateUser)

export default router 