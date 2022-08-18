const { connectToDatabase } = require("../../lib/mongoose");
const { Types } = require("mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
const User = require("../../models/user.model");

module.exports = async (req, res) => {

    if (req.method === 'POST') {
        try {
            await connectToDatabase();
            
            const bet = req.body;
            bet.prediction = Types.ObjectId(bet.prediction);
            bet.user = Types.ObjectId(bet.user);
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