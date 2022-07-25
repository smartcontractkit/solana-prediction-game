const User = require("../models/user.model");

const createUser = async (req, res) => {
  const user = req.body;

  try {
    const userObject = new User(user);
    
    const result = await userObject.save();
    console.log(`User was inserted with the _id: ${result._id}`);

    res.send(result);
  } catch (err) {
    console.error("Failed to create new user, with error code: " + err.message);

    res.status(500).send(err);
  } 
}

const getUser = async (req, res) => {
  const searchQuery  = req.body;

  try {
    const user = await User.findOne(searchQuery);

    res.send(user);
  } catch (err) {
    console.error("Failed to get user, with error code: " + err.message);
    res.status(500).send(err);
  }
}

const getUsers = async (req, res) => {
  const searchQuery  = req.body;

  try {
    const users = await User.find(searchQuery);
    res.send(users);
  } catch (err) {
    console.error("Failed to get users, with error code: " + err.message);
    res.status(500).send(err);
  }
}

module.exports = {
    createUser,
    getUser,
    getUsers
}