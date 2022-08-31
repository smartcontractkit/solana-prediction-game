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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const theDate = new Date(date);

    let day = 'Today';
  
    if (tomorrow.toDateString() === theDate.toDateString()) {
      day = 'Tomorrow';
    }

    let h = theDate.getHours();
    let m = theDate.getMinutes();
    let s = theDate.getSeconds();

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    let time = h + ":" + m + ":" + s;

    return `${time}, ${day}`
}