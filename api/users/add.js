const { connectToDatabase } = require("../../lib/mongoose");
const User = require("../../models/user.model");

/**
 * Vercel cloud function for the creation of a new user
*/
module.exports = async (req, res) => {

  if (req.method === 'POST') {
    try {
      await connectToDatabase();
  
      const user = req.body;
      const userObject = new User(user);
      
      const result = await userObject.save();
      console.log(`User was inserted with the _id: ${result._id}`);
  
      res.send(result);
    } catch (err) {
      console.error("Failed to create new user, with error code: " + err.message);
  
      res.status(500).send(err);
    } 
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}