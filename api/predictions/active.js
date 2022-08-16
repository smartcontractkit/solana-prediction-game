const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * It returns all predictions based if the expirytime is greater or equal than the current time 
 * via the Mongoose driver. 
 * The request is expected to come in as a GET request to `/api/predictions/active`.
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    try {
        await connectToDatabase();
        
        const predictions = await Prediction.find({
            expiryTime: {
                $gte: new Date()
            }
        });
        res.send(predictions);
    } catch (err) {
        console.error("Failed to get predictions, with error code: " + err.message);
        res.status(500).send(err);
    }
}