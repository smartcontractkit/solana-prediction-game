const { connectToDatabase } = require("../../lib/mongoose");
const { Types } = require("mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
const User = require("../../models/user.model");

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. Given the expected 
 * request payload, it generates a new bet entity and stores it in MongoDB. The request
 * is expected to come in as a POST request to `/api/bets/add`. The request body should have the shape:
 * The request body should have the shape based on the bet model (see api/models/bet.model.js).
 * 
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    if (req.method === 'POST') {
        try {
            await connectToDatabase();
            
            const bet = req.body;

            // Here we cast the entity IDs for prediction and user to be MongoDB valid ObjectIds. 
            // MongoDB requires all IDs be in this format.
            bet.prediction = Types.ObjectId(bet.prediction);
            bet.user = Types.ObjectId(bet.user);

            // This instantiates the bet with our modified payload and stores the object 
            // into our MongoDB database using the mongoose driver.
            // Note that mongoose also provides validation.
            const betObject = new Bet(bet);
            
            const result = await (await betObject.save()).populate("user");
            console.log(`Bet was inserted with the _id: ${result._id}`);

            let totalBets = result.user.totalBets + 1;

            const userUpdated = await User
                .findByIdAndUpdate(
                    bet.user, 
                    { totalBets: totalBets },
                    { new: true }
                );

            console.log(`User was update with the _id: ${userUpdated._id}`);
    
            res.send(result);
        } catch (err) {
            console.error("Failed to create new bet, with error code: " + err.message);
    
            res.status(500).send(err);
        } 
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }

}