const { connectToDatabase } = require("../../lib/mongoose");
const User = require("../models/user.model");

module.export = async (req, res) => {
    await connectToDatabase();

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