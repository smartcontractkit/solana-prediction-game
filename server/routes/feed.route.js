const express = require('express');
const router = express.Router();

const { getLatestDataRound } = require('../controllers/feed.controller');

router.get('/getLatestDataRound', getLatestDataRound);

module.exports = router;