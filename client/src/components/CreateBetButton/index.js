import { Button } from "@chakra-ui/react";
import { useState } from "react";
import axiosInstance from "../../helpers/axiosInstance";

export default function CreateBetButton( 
    { 
        predictionId,
        amount,
        address,
        setBetSlip,
        ...props
    }
    ) {
    const [isSaving, setIsSaving] = useState(false);

    const createBet = async (event) => {
        event.preventDefault();
        setIsSaving(true);

        const data = {
            user: address,
            predictionId,
            amount,
            status: 'open',
        }

        axiosInstance.post('/addBet', data)
        .then(res => res.data)
        .then(data => {
            setIsSaving(false);
            setBetSlip(null);
            console.log("Bet created");
        })
        .catch(err => {
            setIsSaving(false);
            setBetSlip(null);
            console.log("Error occured: " + err.message);
        });  
    }


    return (
        <Button
            isLoading={isSaving}
            loadingText="Betting..."
            onClick={createBet}
            {...props}
        >
            Make Bet
        </Button>
    );
}