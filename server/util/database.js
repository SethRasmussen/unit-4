require("dotenv").config();

const { CONNECTION_STRING } = process.env;

// const CONNECTION_STRING =
//   "postgresql://SethRasmussen:v2_3zegc_BnEx7GrV3Fcy3diupmYqpZj@db.bit.io:5432/SethRasmussen/unit-4";

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  //need some options in the sequlize object
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
