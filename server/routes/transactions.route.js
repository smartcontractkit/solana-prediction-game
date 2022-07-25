const express = require('express');
const router = express.Router();

const { escrowTransferSOL } = require("../controllers/transaction.controller");

router.post('/escrowTransferSOL', escrowTransferSOL);

module.exports = router;