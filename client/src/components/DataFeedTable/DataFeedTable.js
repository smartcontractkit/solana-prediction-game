import { Box, Table, TableContainer, Tbody, Td,  Text,  Th, Thead, Tr } from "@chakra-ui/react"
import { useContext } from "react";
import { randomisePrediction } from "../../helpers/randomisePrediction";
import { SocketContext } from "../../providers/SocketProvider";
import PredictionButton from "../PredictionButton/PredictionButton";

const DataFeedTable = () => {
    const { dataFeeds } = useContext(SocketContext);

    return (
        <Box w="100%">
            <h1>Chainlink Solana feeds</h1>
            {
                dataFeeds.length === 0 && <Text> Loading... </Text>
            }
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Pair</Th>
                            <Th isNumeric>Round</Th>
                            <Th isNumeric>Slot</Th>
                            <Th isNumeric>Answer</Th>
                            <Th>observation Time</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            dataFeeds.map(data => {
                                const prediction = randomisePrediction(data.answerToNumber);
                                return (<Tr key={data.pair}>
                                    <Td>{data.pair}</Td>
                                    <Td isNumeric>{data.roundId}</Td>
                                    <Td isNumeric>{data.slot}</Td>
                                    <Td isNumeric>{data.answerToNumber}</Td>
                                    <Th>{data.observationsTS}</Th>
                                    <Th>
                                        <PredictionButton 
                                            pair={data.pair}
                                            feedAddress={data.feed}
                                            predictionData={prediction} 
                                            openingPredictionPrice={data.answerToNumber}
                                            openingPredictionTime={data.observationsTS}
                                        />
                                    </Th>
                                </Tr>)
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}
export default DataFeedTable;