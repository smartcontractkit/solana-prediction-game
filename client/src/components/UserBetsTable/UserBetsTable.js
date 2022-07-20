import { Table, TableContainer, Tbody, Td,  Th, Thead, Tr } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../contexts/UserDataProvider";
import axiosInstance from "../../helpers/axiosInstance";

const UserBetsTable = () => {
    const [ isFetching, setIsFetching ] = useState(true);
    const [ bets, setBets ] = useState([]);

    const { address } = useContext(UserDataContext);

    useEffect(() => {
        axiosInstance.get(`/getUserBets/${address}`)
          .then(res => res.data)
          .then(data => {
            setBets(data);
            setIsFetching(false);
          })
          .catch(err => {
            setIsFetching(false);
            alert("Error occured: " + err.message);
          });
    }, [address]);

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