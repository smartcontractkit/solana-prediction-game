const { connectToDatabase } = require("../../lib/mongoose");
const { Types } = require("mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");

/**
 * Vercel cloud function for the creation of a new bet
*/
module.exports = async (req, res) => {

    if (req.method === 'POST') {
        try {
            await connectToDatabase();
            
            const bet = req.body;

            // Cast the prediction and user id to a mongoose ObjectId
            bet.prediction = Types.ObjectId(bet.prediction);
            bet.user = Types.ObjectId(bet.user);

            // Create the bet
            const betObject = new Bet(bet);
            const result = await betObject.save();
            console.log(`Bet was inserted with the _id: ${result._id}`);
    
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