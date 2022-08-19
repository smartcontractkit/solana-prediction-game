const { connectToDatabase } = require("../../lib/mongoose");
const User = require("../../models/user.model");

/**
 * This function is deployed as a standalone endpoint via Vercel Cloud Functions. Given the expected 
 * request payload, it generates a new user entity and stores it in MongoDB. The request
 * is expected to come in as a POST request to `/api/users/add`. The request body should have the shape:
 * The request body should have the shape based on the user model (see api/models/user.model.js).
 * 
 * @param req NextApiRequest HTTP request object wrapped by Vercel function helpers
 * @param res NextApiResponse HTTP response object wrapped by Vercel function helpers
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