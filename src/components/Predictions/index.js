import { Flex } from "@chakra-ui/react";
import BetCard from "../BetCard";

const Predictions = ({ predictions, dataFeeds}) => {

  return (
        <Flex
          gap="1.5rem"
          flexWrap="wrap"
          justifyContent={["center", "center", "flex-start", "flex-start"]}
      >
          {
              predictions.map(prediction => {
                  const { _id, pair } = prediction;
                  const feed = dataFeeds.find(data => data.pair === pair);
                  return (
                      <BetCard
                          prediction={prediction}
                          feed={feed}
                          key={_id}
                      />
                  );
              })
          }
      </Flex>
  )
};

export default Predictions;