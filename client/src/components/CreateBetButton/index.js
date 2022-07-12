import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMoralis } from "react-moralis";

export default function CreateBetButton( 
    { 
        predictionId,
        status
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
            size="sm"
            rounded="md"
            color={["white", "white", "white", "white"]}
            bg={["black", "black", "black", "black"]}
            _hover={{
                bg: ["primary.700", "primary.700", "primary.700", "primary.700"]
            }}
            isLoading={isSaving}
            loadingText="Saving..."
            onClick={createBet}
            disabled={!status}
            >
            Add Bet
        </Button>
    );
}