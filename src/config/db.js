const { Sequelize } = require("sequelize");
require("dotenv").config();
require("../models");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected Successfully");

    await sequelize.sync({ alter: true });
    console.log("Tables synced");

  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };