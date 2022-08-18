const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");
/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. 
 * The request is expected to come in as a POST request to `/api/bets/status`. 
 * It updates all bet entities from MongoDB with a 'status' of 'ongoing' via the Mongoose driver. 
 * Checks if the bet expiryTime has passed
 * if so, updates the bet status based on the direction of the prediction and opening prediction price to 'won' or 'lost'.
 * 
 * This function is used in conjuction with github actions to update the status of all bets on a hourly basis  using cron
 * Checkout .github/workflows/bet-status-cron.yml for more details
 * This function can be used AWS SQS or Lambda as well
 *
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
 */
module.exports = async (req, res) => {

    if (req.method === 'POST') {
        try {
            await connectToDatabase();
            
            const bets = await Bet
                .find({ status: "ongoing" }) // casts a filter based on the query object and returns a list of bets with status 'ongoing'
                .populate("prediction"); // Populate prediction data to each bet

            let promises = bets.map(async (bet) => {
                // Check if the bet expiryTime has passed if not the function returns
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
        res.status(405).end('Method Not Allowed');
    }

}