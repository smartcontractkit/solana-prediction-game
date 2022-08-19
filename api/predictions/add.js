const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. Given the expected 
 * request payload, it generates a new prediction entity and stores it in MongoDB. The request
 * is expected to come in as a POST request to `/api/predictions/add`. 
 * The request body should have the shape based on the Prediction model (see api/models/prediction.model.js).
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
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