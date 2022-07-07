export const getTruncatedAddress = (address) => {
    return `${ address.slice(0, 6) }...${ address.slice(-4) }`
}

export const roundOff = (num, precision) => {
    if(typeof num === 'string'){
        num = parseFloat(num)
    }
    return parseFloat(num.toFixed(precision));
}