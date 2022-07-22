const express = require('express');
const router = express.Router();

const { createUser, getUser, getUsers } = require('../controllers/user.controller');

router.post('/addUser', createUser);
  
router.get('/getUser', getUser);
  
router.get('/getUsers', getUsers);

module.exports = router;