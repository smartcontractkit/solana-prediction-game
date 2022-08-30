const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * It returns all predictions via the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/predictions`.
 * An optional parameter active can be passed to filter the predictions that haven't expired yet
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    try {
        await connectToDatabase();

        const { active } = req.query;

        let query = null

        if (active) {
            query = {
                expiryTime: {
                    $gte: new Date()
                }
            }
        }
        
        const predictions = await Prediction
            .find(query)
            .sort('-createdAt'); // Sort the bets by createdAt field descending
        
        res.send(predictions);
    } catch (err) {
        console.error("Failed to get predictions, with error code: " + err.message);
        res.status(500).send(err);
    }
}