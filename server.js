const express = require("express");
require("dotenv").config();

const { connectDB } = require("./src/config/db");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});