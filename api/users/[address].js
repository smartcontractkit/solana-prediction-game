const { connectToDatabase } = require("../../lib/mongoose");
const User = require("../../models/user.model");

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * Given the expected request query payload of a user address, 
 * it retrieves a single bet entity from MongoDB based on from the Mongoose driver. 
 * For more info: (https://mongoosejs.com/docs/queries.html).
 * The request is expected to come in as a GET request to `/api/users/getUser?address=[address]`. 
 * The request query requires an address parameter.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {
    try {
        await connectToDatabase();
        
        const { address }  = req.query;

        if (!address) {
            return res.status(400).json({
                message: "Address is required"
            });
        }
        const user = await User.findOne({ address });

        res.send(user);
    } catch (err) {
        console.error("Failed to get user, with error code: " + err.message);
        res.status(500).send(err);
    }
}