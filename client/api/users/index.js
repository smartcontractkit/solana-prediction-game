const User = require("../../models/user.model");
const { connectToDatabase } = require("../../lib/mongoose");

module.exports = async (req, res) => {

    await connectToDatabase();
    
    const searchQuery  = req.body;

    try {
        const users = await User.find(searchQuery);
        res.send(users);
    } catch (err) {
        console.error("Failed to get users, with error code: " + err.message);
        res.status(500).send(err);
    }
}