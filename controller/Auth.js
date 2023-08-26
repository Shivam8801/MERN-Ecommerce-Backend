import User from "../model/User.js";



const createUser = async (req, res) => {
    const user = new User(req.body)
    try {
        const response = await user.save()
        res.status(201).json(response)
    }
    catch (err) {
        res.status(400).json(err)
    }
}


const loginUser = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email }, "id name email")

        if (user.password === req.body.password) {
            res.status(201).json(user)
        }
        else {
            res.status(401).json({ message: 'Invalid Credentials!' })
        }
    }
    catch (err) {
        res.status(400).json(err)
    }
}


export { createUser, loginUser }