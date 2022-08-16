const User = require("../../models/user.model");
const { connectToDatabase } = require("../../lib/mongoose");

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * Given the expected request query payload, it retrieves bet entities from MongoDB based on queries from the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/users`. The request query can be empty or follow
 * the model data  at /models/bet.model.js and mongoose docs: https://mongoosejs.com/docs/queries.html.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    try {
        await connectToDatabase();
        
        const searchQuery  = req.body;
        const users = await User.find(searchQuery);
        res.send(users);
    } catch (err) {
        console.error("Failed to get users, with error code: " + err.message);
        res.status(500).send(err);
    }
}