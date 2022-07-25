const express = require('express');
const router = express.Router();

const { createUser, getUser, getUsers } = require('../controllers/user.controller');

router.get('/', getUsers);
router.post('/addUser', createUser);
router.get('/getUser', getUser);

module.exports = router;