
const User = require('../models/User'); 

const getCart = async (req, res) => {
    try {
       
        const user = await User.findById(req.user._id);

        if (user) {
            
            return res.json({ items: user.cart || [] });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const updateCart = async (req, res) => {
    // console.log("req.body =", req.body); 

    const { items } = req.body;

    if (!items) {
        return res.status(400).json({ message: "Missing items" });
    }

    try {

        const user = await User.findById(req.user._id);

        if (user) {
   
            user.cart = items; 

            const updatedUser = await user.save();

            return res.json({ items: updatedUser.cart });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Save cart failed:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { getCart, updateCart };
