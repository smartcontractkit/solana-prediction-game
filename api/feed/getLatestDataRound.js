const latestDataRound = require("../../lib/latestDataRound");

module.exports = async (req, res) => {

    const { address, pair } = req.query;
    if(!address || !pair) {
        res.status(400).send('Missing address or pair');
        return;
    }

    try {
        const round = await latestDataRound(address, pair);
        res.status(200).send(round);
    }

    catch(err) {
        res.status(500).send(err);
    }
} 