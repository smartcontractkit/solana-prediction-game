const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");

/**
 * Vercel cloud function 
 * Creates a new prediction
*/

module.exports = async (req, res) => {

    if (req.method === 'POST') {
        try {
            await connectToDatabase();
        
            const prediction  = req.body;
            const predictionObject = new Prediction(prediction);
            
            const result = await predictionObject.save();
            console.log(`Prediction was inserted with the _id: ${result._id}`);

            res.send(result);
        } catch (err) {
            console.error("Failed to create new prediction, with error code: " + err.message);

            res.status(500).send(err);
        } 
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}