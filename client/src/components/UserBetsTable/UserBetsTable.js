import { Table, TableContainer, Tbody, Td,  Th, Thead, Tr } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const UserBetsTable = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const [ bets, setBets ] = useState([]);

    const {
        user,
    } = useMoralis();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/getUserBets/${user.get("solAddress")}`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST",
              "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
            },
          })
          .then(res => res.json())
          .then(data => {
            setBets(data);
            setIsFetching(false);
          })
          .catch(err => {
            setIsFetching(false);
            alert("Error occured: " + err.message);
          });
    }, [user]);

    if(isFetching) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>User Bets</h1>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Prediction ID</Th>
                            <Th>Pair</Th>
                            <Th isNumeric>Opening Price</Th>
                            <Th isNumeric>Prediction Price</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            bets.map(bet => {
                                return (
                                    <Tr key={bet?.objectId}>
                                        <Td>{bet?.objectId}</Td>
                                        <Td>{bet?.predictionId}</Td>
                                        <Td>{bet?.parent?.pair}</Td>
                                        <Th isNumeric>{bet?.parent?.openingPredictionPrice}</Th>
                                        <Th isNumeric>{bet?.parent?.prediction}</Th>
                                        <Td isNumeric>{bet?.amount}</Td>
                                        <Td>{bet?.status}</Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default UserBetsTable;