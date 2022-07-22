const express = require('express');
const router = express.Router();

const { createPrediction, getPredictions, scheduleDailyPredictions } = require('../controllers/prediction.controller');

router.post('/addPrediction', createPrediction);
  
router.get('/getPredictions', getPredictions);

router.get('/scheduleDailyPredictions', scheduleDailyPredictions);

module.exports = router;