const express = require('express');
const router = express.Router();

const { createBet, getBet, getBets } = require('../controllers/bet.controller');

router.post('/addBet', createBet);
router.get('/getBet', getBet);
router.get('/getBets', getBets);

module.exports = router;