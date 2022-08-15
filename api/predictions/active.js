const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");

/**
 * Vercel cloud function 
 * Returns all active predictions 
 * based if the expirytime is greater or equal than the current time
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