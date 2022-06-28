import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { Prediction } from "../../models/prediction.model";

export default function PredictionButton( 
  { predictionData, pair, feedAddress, answer, observationTs }
  ) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    user,
  } = useMoralis();


  const createPrediction = () => {
    setIsSaving(true);
    const prediction = Prediction.createPrediction({
      owner: user.get("solAddress"),
      account: feedAddress,
      pair: pair,
      prediction: predictionData,
      expiryTime: observationTs,
      predictionDeadline: new Date() + 1000 * 60 * 60 * 24,
      openingPredictionPrice: answer,
      status: true,
    }, setIsSaving);

    console.log("Prediction created: ", prediction);
  }

  return (
    <Button
        size="sm"
        rounded="md"
        color={["white", "white", "white", "white"]}
        bg={["black", "black", "black", "black"]}
        _hover={{
            bg: ["primary.700", "primary.700", "primary.700", "primary.700"]
        }}
        isLoading={isSaving}
        loadingText="Saving..."
        onClick={createPrediction}
        >
          Add Prediction
    </Button>);
}