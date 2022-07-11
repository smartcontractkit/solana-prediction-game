import { Text } from '@chakra-ui/react';
import React from 'react';
import { useCountdown } from '../../hooks/useCountDown';

const ShowCounter = ({ days, hours, minutes, seconds, ...props }) => {
  return (
    <Text {...props}>
        {days}d {hours}h {minutes}m {seconds}s
    </Text>
  );
};

const CountdownTimer = ({ targetDate, ...props }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);
    return (
        <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        {...props}
        />
    );
};

export default CountdownTimer;
