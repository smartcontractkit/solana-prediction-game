import { Table, TableContainer, Tbody, Td,  Th, Thead, Tr } from "@chakra-ui/react"
import { useAddressDataFeed } from '../../hooks/useAddressDataFeed';
import PredictionButton from "../PredictionButton/PredictionButton";

const DataFeedTable = () => {
    const dataFeeds = useAddressDataFeed();
    const pairs = Object.keys(dataFeeds);

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
                            pairs.map(pair => {
                                let data = dataFeeds[pair]?.roundData;
                                const prediction = Math.floor(data?.answerToNumber * (1 + (Math.floor(Math.random()*10))/100)); 
                                return (<Tr key={pair}>
                                    <Td>{pair}</Td>
                                    <Td isNumeric>{data?.roundId}</Td>
                                    <Td isNumeric>{data?.slot}</Td>
                                    <Td isNumeric>{data?.answerToNumber}</Td>
                                    <Th>{data?.observationsTS}</Th>
                                    <Th>
                                        <PredictionButton 
                                            pair={pair}
                                            feedAddress={data?.feed}
                                            predictionData={ prediction } // will be user based
                                            openingPredictionPrice={data?.answerToNumber}
                                            openingPredictionTime={data?.observationsTS}
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