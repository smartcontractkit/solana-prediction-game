const { connectToDatabase } = require("../../lib/mongoose");
const User = require("../../models/user.model");

module.exports = async (req, res) => {

    await connectToDatabase();
    
    const searchQuery  = req.body;

    try {
        const user = await User.findOne(searchQuery);

        res.send(user);
    } catch (err) {
        console.error("Failed to get user, with error code: " + err.message);
        res.status(500).send(err);
    }
}