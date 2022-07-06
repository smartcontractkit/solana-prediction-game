export const validatePrediction = (data, setIsSaving) => {
    if (!data.owner) {
        alert("Login is required")
        setIsSaving(false);
        throw new Error("Login is required");
    }
    if (!data.account) {
        alert("Feed Address is required")
        setIsSaving(false);
        throw new Error("Feed Address is required");
    }
    if (!data.pair) {
        alert("pair is required")
        setIsSaving(false);
        throw new Error("pair is required");
    }
    if (!data.prediction) {
        alert("prediction is required")
        setIsSaving(false);
        throw new Error("prediction is required");
    }
    if (!data.expiryTime) {
        alert("expiryTime is required")
        setIsSaving(false);
        throw new Error("expiryTime is required");
    }
    if (!data.predictionDeadline) {
        alert("predictionDeadline is required")
        setIsSaving(false);
        throw new Error("predictionDeadline is required");
    }
    if (!data.openingPredictionPrice) {
        alert("openingPredictionPrice is required")
        setIsSaving(false);
        throw new Error("openingPredictionPrice is required");
    }
    if (!data.openingPredictionTime) {
        alert("openingPredictionTime is required")
        setIsSaving(false);
        throw new Error("openingPredictionTime is required");
    }
    if (!data.status) {
        alert("status is required")
        setIsSaving(false);
        throw new Error("status is required");
    }
}
