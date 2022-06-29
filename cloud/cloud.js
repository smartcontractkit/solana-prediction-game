Moralis.Cloud.define("getPredictions", async (request) => {
    return getPredictions(request.params.status);
});

Moralis.Cloud.job("addOnePercentPrediction", (request) =>  {
    // params: passed in the job call
    // headers: from the request that triggered the job
    // log: the Moralis Server logger passed in the request
    // message: a function to update the status message of the job object
    const { params, headers, log, message } = request;
    message("I just started");
    return "Hello I'm a job";
});