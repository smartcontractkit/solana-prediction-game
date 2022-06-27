import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMoralis, useNewMoralisObject } from "react-moralis";

export default function PredictionButton( 
  { prediction, answer, observationTs }
  ) {
  const { save } = useNewMoralisObject("Predictions");
  const [isSaving, setIsSaving] = useState(false);

  const {
    user,
  } = useMoralis();

  const createPrediction = async () => {
    setIsSaving(true);
    const data = {
      owner: user.get("solAddress"),
      prediction,
      answer,
      observationTs
    };

    save(data, {
      onSuccess: (prediction) => {
        setIsSaving(false);
        // Execute any logic that should take place after the object is saved.
        alert("New object created with objectId: " + prediction.id);
      },
      onError: (error) => {
        setIsSaving(false);
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        alert("Failed to create new object, with error code: " + error.message);
      },
    });
  };

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
            Predict {prediction}
    </Button>);
}