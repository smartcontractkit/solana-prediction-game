import { Table, TableContainer, Tbody, Td,  Th, Thead, Tr } from "@chakra-ui/react"
import { randomisePrediction } from "../../helpers/randomisePrediction";
import { useAddressDataFeed } from '../../hooks/useAddressDataFeed';
import PredictionButton from "../PredictionButton/PredictionButton";

const DataFeedTable = () => {
    const { dataFeeds, isLoading } = useAddressDataFeed();

    if(isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Chainlink Solana feeds</h1>
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
        </div>
    )
}
export default DataFeedTable;