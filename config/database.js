const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose.connect(process.env.DB_URL);
  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected");
  });
};
module.exports = dbConnect;
