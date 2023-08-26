import User from "../model/User.js";

const fetchUserById = async (req, res) => {

    const { id } = req.params

    try {
        const user = await User.findById(id, "name email id").exec();
        res.status(200).json(user)
    }

    catch (err) {
        res.status(400).json(err)
    }
}



const updateUser = async (req, res) => {
    const { id } = req.params


    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(user)
    }
    catch (err) {
        res.status(400).json(err)
    }
}



export { fetchUserById, updateUser }