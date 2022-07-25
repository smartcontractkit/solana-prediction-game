export const randomisePrediction = (prediction) => {
    return Math.floor(prediction * (1 + (Math.floor(Math.random()*10))/100)); 
}