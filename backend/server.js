const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const {
  errorResposerHandler,
  invalidPathHandler,
} = require("./middelware/errorHandlers");

const app = express();

dotenv.config();

app.use(invalidPathHandler);
app.use(errorResposerHandler);

//connectDB
connectDB();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
