import { useNewMoralisObject, useMoralisQuery } from "react-moralis";

export class Prediction {

    constructor(owner, account, pair, prediction, expiryTime, predictionDeadline, openingPredictionPrice, status){
        this.owner = owner;
        this.account = account;
        this.pair = pair;
        this.prediction = prediction;
        this.expiryTime = expiryTime;
        this.predictionDeadline = predictionDeadline;
        this.openingPredictionPrice = openingPredictionPrice;
        this.status = status;
    }

    moralisObject = useNewMoralisObject("Prediction");

    createPrediction =  async (data, setIsSaving) => {
        let predictionData = null;
        this.moralisObject.save(data, {
          onSuccess: (prediction) => {
              setIsSaving(false);
              console.log("Prediction created: ", prediction);
          },
          onError: (error) => {
              setIsSaving(false);
              console.log("Error occured: " + error.message);
          },
        });
        return predictionData;    
    }

    getActivePredictions = async (isFetching) => {
        let predictions = null;
        const moralisQuery = useMoralisQuery(
            "Prediction",
            (query) => query.equalTo("status", true),
            [],
            { autoFetch: true }
        );
        predictions = await moralisQuery.fetch();
        return predictions;
    }


}

module.exports = Prediction;