import Product from '../model/Product.js'

const createProduct = async (req, res) => {
    const product = new Product(req.body)
    try {
        const response = await product.save()
        res.status(201).json(response)
    }
    catch (err) {
        res.status(400).json(err)
    }
}


const fetchAllProducts = async (req, res) => {
    let query = Product.find({})
    let totalProductsQuery = Product.find({})

    if (req.query.category) {
        query = query.find({ category: req.query.category })
        totalProductsQuery = totalProductsQuery.find({ category: req.query.category })
    }

    if (req.query.brand) {
        query = query.find({ brand: req.query.brand })
        totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand })
    }


    if (req.query._sort && req.query._order) {
        query = query.sort({ [req.query._sort]: req.query._order })
    }

    const totalDocs = await totalProductsQuery.count().exec()
    console.log({ totalDocs })

    if (req.query._page && req.query._limit) {
        const pageSize = req.query._limit
        const page = req.query._page
        query = query.skip(pageSize * (page - 1)).limit(pageSize)
    }


    try {
        const response = await query.exec()
        res.set('X-Total-Count', totalDocs)
        res.status(200).json(response)
    }
    catch (err) {
        res.status(400).json(err)
    }
}


const fetchProductsByID = async (req, res) => {
    const { id } = req.params


    try {
        const product = await Product.findById(id)
        res.status(200).json(product)
    }
    catch (err) {
        res.status(400).json(err)
    }
}


const updateProduct = async (req, res) => {
    const { id } = req.params


    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(product)
    }
    catch (err) {
        res.status(400).json(err)
    }
}




export { createProduct, fetchAllProducts, fetchProductsByID, updateProduct }