require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

module.exports = {
  isAuthenticated: (req, res, next) => {
    // this is the authorization parameter on the req being stored to a variable
    const headerToken = req.get("Authorization");

    // this checks to see if there is not headerToken and returns an error
    if (!headerToken) {
      console.log("ERROR IN auth middleware");
      res.sendStatus(401);
    }

    let token;

    try {
      //this is using jwt and the verify method to decrypt the token with secret code. If the user has correct token then they are logged in
      token = jwt.verify(headerToken, SECRET);
    } catch (err) {
      //if there is a problem with jwt.verify or SECRET for example, this will throw an error
      err.statusCode = 500;
      throw err;
    }

    //if you have no token you arent logged in and this serves an error
    if (!token) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }
    //runs next function in the endpoint
    next();
  },
};
