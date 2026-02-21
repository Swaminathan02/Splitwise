const express = require("express");
require("dotenv").config();

const sequelize = require("./src/config/db");
require("./src/models");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected Successfully");

    await sequelize.sync({ alter: true });
    console.log("Tables synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("DB Error:", error.message);
  }
};

startServer();