import Brand from '../model/Brand.js'

const fetchBrands = async (req, res) => {
    try{
        const brands = await Brand.find({}).exec();
        res.status(200).json(brands)
    }

    catch(err)
    {
        res.status(400).json(err)
    }
}

const createBrand = async (req, res) => {
    const brand = new Brand(req.body)
    try {
        const response = await brand.save()
        res.status(201).json(response)
    }
    catch (err) {
        res.status(400).json(err)
    }
}


export {fetchBrands, createBrand}
