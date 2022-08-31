import { add, format, sub } from 'date-fns';
export const getTruncatedAddress = (address) => {
    return `${ address.slice(0, 6) }...${ address.slice(-4) }`
}

export const roundOff = (num, precision) => {
    if(typeof num === 'string'){
        num = parseFloat(num)
    }
    return parseFloat(num.toFixed(precision));
}

export const getCurrenciesFromPairs = (pair) => {
    return {
        firstCurrency: pair.split('/')[0],
        secondCurrency: pair.split('/')[1]
    }
} 

export const formatDate = (date) => {
    const tomorrow = add(new Date(),{
        days: 1
    })
    const yesterday = sub(new Date(),{
        days: 1
    })

    const theDate = new Date(date);

    let day = 'Today';

    if (tomorrow.toDateString() === theDate.toDateString()) {
        day = 'Tomorrow';
    }

    if (yesterday.toDateString() === theDate.toDateString()) {
        day = 'Yesterday';
    }

    let time = format(theDate, 'hh:mm:ss');

    return `${time}, ${day}`
    
}