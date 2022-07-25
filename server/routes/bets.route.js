const express = require('express');
const router = express.Router();

const { createBet, getBet, getBets } = require('../controllers/bet.controller');

router.get('/', getBets);
router.post('/addBet', createBet);
router.get('/getBet', getBet);

module.exports = router;