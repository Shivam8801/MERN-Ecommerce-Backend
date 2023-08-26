import express from 'express'
import mongoose from 'mongoose'
const server = express()
import productRouters from './routes/Products.js'
import brandRouters from './routes/Brands.js'
import categoryRouters from './routes/Categories.js'
import userRouters from './routes/User.js'
import authRouters from './routes/Auth.js'

import cors from 'cors'

// middlewares

server.use(cors(
    { exposedHeaders: ['X-Total-Count'] }
))

server.use(express.json()) // to parse req.body
server.use('/products', productRouters)
server.use('/brands', brandRouters)
server.use('/categories', categoryRouters)
server.use('/users', userRouters)
server.use('/auth', authRouters)



main().catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('Database Connected!')
}



server.get('/', (req, res) => {
    res.json({ status: "Success" })
})



server.listen(8080, () => {
    console.log("server started!")
})