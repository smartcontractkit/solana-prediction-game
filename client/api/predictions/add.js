const { connectToDatabase } = require("../../lib/mongoose");
const Prediction = require("../../models/prediction.model");

module.export = async (req, res) => {
    await connectToDatabase();

    const prediction  = req.body;

    try {
        const predictionObject = new Prediction(prediction);
        
        const result = await predictionObject.save();
        console.log(`Prediction was inserted with the _id: ${result._id}`);

        res.send(result);
    } catch (err) {
        console.error("Failed to create new prediction, with error code: " + err.message);

        res.status(500).send(err);
    } 
}