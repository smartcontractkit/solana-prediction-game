import { Button } from "@chakra-ui/react";
import { useState } from "react";

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

        fetch(`${process.env.REACT_APP_SERVER_URL}/addBet`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
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