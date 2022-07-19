import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import { validatePrediction } from "../../helpers/validatePrediction";
import axiosInstance from "../../helpers/axiosInstance";

export default function PredictionButton( 
  { 
    predictionData, 
    pair, 
    feedAddress,
    openingPredictionPrice,
    openingPredictionTime,
  }
  ) {
  const [isSaving, setIsSaving] = useState(false);
  const [ prediction, setPrediction ] = useState(null);

  const {
    user,
  } = useMoralis();

  const createPrediction = async () => {
    setIsSaving(true);

    var date = new Date();
    const data = {
      owner: user.get("solAddress"),
      account: feedAddress,
      pair,
      prediction: predictionData,
      expiryTime: new Date(date.setDate(date.getDate() + 1)),
      predictionDeadline: new Date(date.setDate(date.getHours() + 1)),
      openingPredictionPrice,
      openingPredictionTime,
      status: true,
    }
    
    validatePrediction(data, setIsSaving);

    axiosInstance.post('/addPrediction', data)
    .then(res => res.data)
    .then(data => {
      setPrediction(data);
      setIsSaving(false);
      alert("Prediction created");
    })
    .catch(err => {
      setIsSaving(false);
      alert("Error occured: " + err.message);
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