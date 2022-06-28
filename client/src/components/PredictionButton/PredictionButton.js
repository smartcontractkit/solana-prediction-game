import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMoralis, useNewMoralisObject } from "react-moralis";
import { validate } from "../../helpers/validate";

export default function PredictionButton( 
  { 
    predictionData, 
    pair, 
    feedAddress, 
    openingPredictionPrice, 
    openingPredictionTime 
  }
  ) {
  const [isSaving, setIsSaving] = useState(false);

  const { save } = useNewMoralisObject("Prediction");
  const [ prediction, setPrediction ] = useState(null);

  const {
    user,
  } = useMoralis();

  const createPrediction = async () => {
    setIsSaving(true);

    const data = {
      owner: user.get("solAddress"),
      account: feedAddress,
      pair,
      prediction: predictionData,
      expiryTime: new Date() + 1000 * 60 * 60 * 24,
      predictionDeadline: new Date() + 1000 * 60 * 60 * 24,
      openingPredictionPrice,
      openingPredictionTime,
      status: true,
    }
    
    validate(data)
    
    save(data, {
        onSuccess: (predictionData) => {
            setPrediction(predictionData);
            setIsSaving(false);
            alert("Prediction created: ", predictionData);
        },
        onError: (error) => {
            setIsSaving(false);
            alert("Error occured: " + error.message);
        },
    });
    return prediction;    
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