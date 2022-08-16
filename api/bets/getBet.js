const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. Given the expected 
 * request query payload, it retrieves a single bet entity from MongoDB based on queries from the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/bets/getBet`. The request query can be empty or follow
 * the model data  at /models/bet.model.js and mongoose docs: https://mongoosejs.com/docs/queries.html.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    try {
        await connectToDatabase();
            
        const searchQuery  = req.query;

        // This retrieves a single bet entity with a its parent prediction entity 
        // via MongoDB database using the mongoose driver.
        const bet = await Bet.findOne(searchQuery)
        .populate("prediction");

        res.send(bet);
    } catch (err) {
        console.error("Failed to get bet, with error code: " + err.message);
        res.status(500).send(err);
    }

}