getPredictions = async (status) => {
    const query = new Moralis.Query("Prediction");
    if(status) {
        query.equalTo("status", status);
    }
    return  await query.find();    
}
