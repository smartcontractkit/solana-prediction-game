const { connectToDatabase } = require("../../../lib/mongoose");
const Bet = require("../../../models/bet.model");
const Prediction = require("../../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * Given the expected request query payload, it retrieves bet entities from MongoDB 
 * based on queries from the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/bets/user/[user]`. 
 * The request query must have user paramater to filter by user.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

  try {
    await connectToDatabase();
  
    // This is not a secure way to lookup users. For demo purposes, we did not implement API authorization. 
    // In your application, you should implement some authorization strategy, such as JWTs, that you can validate 
    // and securely retrieve the user's details.
    const { address } = req.query;

    if (!address) { 
      res.status(400).send('Bad request: address required');
      return;
    }
    
    const bets = await Bet
      .find({ address }) // Casts a filter based on the user id and returns a list of bets
      .sort('-createdAt') // Sort the bets by createdAt field descending
      .populate('prediction'); // Populate prediction data to each bet

    res.send(bets);
  } catch (err) {
    console.error("Failed to get bets, with error code: " + err.message);
    res.status(500).send(err);
  }
}