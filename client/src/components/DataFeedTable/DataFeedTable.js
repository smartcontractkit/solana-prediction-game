import { Table, TableContainer, Tbody, Td,  Th, Thead, Tr } from "@chakra-ui/react"
import { useAddressDataFeed } from '../../hooks/useAddressDataFeed';
import PredictionButton from "../PredictionButton/prediction";

const DataFeedTable = () => {
    let df = useAddressDataFeed()
    const feeds = Object.keys(df);

    return (
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
                        feeds.map(feed => {
                            let data = df[feed]?.roundData;
                            return (<Tr key={feed}>
                                <Td>{feed}</Td>
                                <Td isNumeric>{data?.roundId}</Td>
                                <Td isNumeric>{data?.slot}</Td>
                                <Td isNumeric>{data?.answerToNumber}</Td>
                                <Th>{data?.observationsTS}</Th>
                                <Th>
                                    <PredictionButton 
                                        prediction={data?.prediction}
                                        answer={data?.answerToNumber}
                                        observationTs={data?.observationsTS}
                                    />
                                </Th>
                            </Tr>)
                        })
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}
export default DataFeedTable;