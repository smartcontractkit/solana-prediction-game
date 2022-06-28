import { useEffect, useState } from "react";
import { Prediction } from "../../models/prediction.model";
import { Table, TableContainer, Tbody, Td,  Th, Thead, Tr } from "@chakra-ui/react"

const ActivePredictions = () => {
    const [predictions, setPredictions] = useState([]);
    useEffect(()=> {
        setPredictions(Prediction.getActivePredictions());
    },[])
    return (
        <div>
            <h1>Active Predictions: {predictions.length}</h1>

            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Feed</Th>
                            <Th>Prediction</Th>
                            <Th>Deadline</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            predictions.map(prediction => {
                                return (
                                    <Tr key={prediction.id}>
                                        <Td>{prediction.id}</Td>
                                        <Td>{prediction.prediction}</Td>
                                        <Td>{prediction.predictionDeadline}</Td>
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
export default ActivePredictions;