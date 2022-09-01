import { formatRelative } from 'date-fns';
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
    return formatRelative(new Date(date), new Date());
}