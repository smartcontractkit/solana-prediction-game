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
            
            const result = await betObject.save();
            console.log(`Bet was inserted with the _id: ${result._id}`);

            // const user = await User
            //     .findByIdAndUpdate(
            //         bet.user, 
            //         { winRate: winRate, wonTotalBets: totalWonBets }, 
            //         { new: true }
            //     );

            // console.log(`Bet was inserted with the _id: ${result._id}`);
    
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