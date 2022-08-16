const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. Given the expected 
 * request query payload, it retrieves prediction entities from MongoDB based on queries from the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/predictions`. The request query can be empty or follow
 * the model data  at /models/prediction.model.js and mongoose docs: https://mongoosejs.com/docs/queries.html.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    try {
        await connectToDatabase();
        
        const searchQuery  = req.query;
        const predictions = await Prediction.find(searchQuery);
        res.send(predictions);
    } catch (err) {
        console.error("Failed to get predictions, with error code: " + err.message);
        res.status(500).send(err);
    }
}