const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./db/db");
const {
  errorResposerHandler,
  invalidPathHandler,
} = require("./middelware/errorHandlers");

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routers
const userRoute = require("./routes/userRoute");

//connectDB
connectDB();

//Routes
app.use("/api/users", userRoute);

//errorHandlers
app.use(invalidPathHandler);
app.use(errorResposerHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
