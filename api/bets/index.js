const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. Given the expected 
 * request query payload, it retrieves bet entities from MongoDB based on queries from the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/bets`. The request query can be empty or follow
 * the model data  at /models/bet.model.js and mongoose docs: https://mongoosejs.com/docs/queries.html.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

  try {
    await connectToDatabase();
  
    const searchQuery  = req.query;

    
    const bets = await Bet
    .find(searchQuery) // find casts a filter based on the searchQuery object and returns a list of bets
    .sort('-createdAt') // Sort the bets by createdAt field descending
    .populate("prediction"); // Populate prediction data to each 

    res.send(bets);
  } catch (err) {
    console.error("Failed to get bets, with error code: " + err.message);
    res.status(500).send(err);
  }
}