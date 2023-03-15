require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { SECRET } = process.env;

const logout = (req, res) => {
  console.log("logout");
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    foundUser = await User.findOne({ where: { username: username } });
    if (foundUser) {
      const isAuthenticated = bcrypt.compareSync(
        password,
        foundUser.hashedPass
      );
      if (isAuthenticated) {
        const token = createToken(
          foundUser.dataValues.username,
          foundUser.dataValues.id
        );
        const exp = Date.now() + 1000 * 60 * 60 * 48;
        res.status(200).send({
          username: foundUser.dataValues.username,
          userId: foundUser.dataValues.id,
          token: token,
          exp: exp,
        });
        console.log("Login Successful");
      } else {
        res.status(400).send("Password is incorrect");
      }
    } else {
      res.status(400).send("User doesnt exist");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong :(");
  }
};
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ where: { username: username } });

    if (foundUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = await User.create({
        username: username,
        hashedPass: hash,
      });

      const token = createToken(
        newUser.dataValues.username,
        newUser.dataValues.id
      );
      const exp = Date.now() + 1000 * 60 * 60 * 48;
      res.status(200).send({
        username: newUser.dataValues.username,
        userId: newUser.dataValues.id,
        token: token,
        exp: exp,
      });
    }
  } catch (error) {
    console.log("ERROR IN register");
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports = {
  register,
  login,
  logout,
};

const createToken = (username, id) => {
  return jwt.sign({ username, id }, SECRET, { expiresIn: "2 days" });
};
