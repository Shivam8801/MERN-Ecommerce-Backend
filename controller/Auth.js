import User from "../model/User.js";


const createUser = async (req, res) => {
    const user = new User(req.body)
    try {
        const response = await user.save()
        res.status(201).json({ id: response.id, role: response.role })
    }
    catch (err) {
        res.status(400).json(err)
    }
}


const loginUser = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email }).exec()

        if (!user) {
            res.status(401).json({ message: 'Email does not exist!' })
        }

        else if (user.password === req.body.password) {
            res.status(201).json({ id: user.id, role: user.role })
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