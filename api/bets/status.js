const { connectToDatabase } = require("../../lib/mongoose");
const Bet = require("../../models/bet.model");
const Prediction = require("../../models/prediction.model");

module.exports = async (req, res) => {

    if (req.method === ('POST' || 'PUT' || 'PATCH')) {
        try {
            await connectToDatabase();

            const { _id, status } = req.body;
            if (!_id || !status) {
                throw new Error("Missing required parameters");
            }
            
            // const bet = await Bet.findById(_id);
            // bet.status = status;
            // const result = await bet.save();
            const result = await Bet.findOneAndUpdate({ _id }, { status }, {
                new: true
            });
            console.log(`Bet was inserted with the _id: ${result._id}`);
    
            res.send(result);
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