import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMoralis } from "react-moralis";
import axiosInstance from "../../helpers/axiosInstance";

export default function CreateBetButton( 
    { 
        predictionId,
        ...props
    }
    ) {
    const [isSaving, setIsSaving] = useState(false);
    const [ bet, setBet ] = useState(null);

    const {
        user,
    } = useMoralis();

    const createBet = async () => {
        setIsSaving(true);

        const data = {
            user: user.get("solAddress"),
            predictionId,
            amount: 1,
            status: 'open',
        }

        axiosInstance.post('/addBet', data)
        .then(res => res.data)
        .then(data => {
            setBet(data);
            setIsSaving(false);
            console.log("Bet created");
        })
        .catch(err => {
            setIsSaving(false);
            console.log("Error occured: " + err.message);
        });
        
        return bet;    
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