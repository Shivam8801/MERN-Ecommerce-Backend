import express from 'express'
import mongoose from 'mongoose'
const server = express()
import productRouters from './routes/Products.js'

// middlewares

server.use(express.json()) // to parse req.body
server.use('/products', productRouters)



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