const mongoose = require("mongoose");

const connectDB = async function() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("DataBase connected...");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
