const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");

/**
 * Vercel cloud function 
 * Udates all bets with the status of "ongoing"
 * Checks if the bet expiryTime has passed
 * if so, updates the bet status based on the direction of the prediction and opening prediction price
*/
module.exports = async (req, res) => {

    if (req.method === ('POST' || 'PUT' || 'PATCH')) {
        try {
            await connectToDatabase();
            
            const bets = await Bet.find({
                status: "ongoing"
            }).populate("prediction");

            let promises = bets.map(async (bet) => {
                if(bet.prediction.expiryTime < new Date().toISOString()) {
                    return bet;
                }
                
                let currentStatus = 'ongoing';

                if(bet.prediction.direction){
                    bet.prediction.predictionPrice > bet.prediction.openingPredictionPrice 
                    ? currentStatus = 'won' 
                    : currentStatus = 'lost';
                }else{
                    bet.prediction.predictionPrice < bet.prediction.openingPredictionPrice 
                    ? currentStatus = 'won' 
                    : currentStatus = 'lost';
                }
                const result = await Bet.findOneAndUpdate({ _id: bet._id }, { status: currentStatus }, {
                    new: true
                });

                console.log(`Bet was inserted with the _id: ${result._id}`);
                return result;
            })
            
            Promise.all(promises).then((predictions) => {
                res.status(200).send(predictions);
            });
        } catch (err) {
            console.error("Failed to update bet, with error code: " + err.message);
    
            res.status(500).send(err);
        } 
    } else {
        res.setHeader('Allow', 'POST');
        res.setHeader('Allow', 'PUT');
        res.setHeader('Allow', 'PATCH');
        res.status(405).end('Method Not Allowed');
    }

}