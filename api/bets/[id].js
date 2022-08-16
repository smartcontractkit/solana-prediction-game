const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * Given the expected request query payload of a bet id, 
 * it retrieves a single bet entity from MongoDB based on from the Mongoose driver. 
 * For more info: (https://mongoosejs.com/docs/queries.html).
 * The request is expected to come in as a GET request to `/api/bets/getBet?id=[id]`. 
 * The request query requires an id parameter.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    try {
        await connectToDatabase();
            
        const { id }  = req.query;

        // This retrieves a single bet entity based on it ID 
        // with its parent prediction entity  via MongoDB database using the mongoose driver.
        const bet = await Bet
            .findById(id)
            .populate("prediction");

        res.send(bet);
    } catch (err) {
        console.error("Failed to get bet, with error code: " + err.message);
        res.status(500).send(err);
    }

}