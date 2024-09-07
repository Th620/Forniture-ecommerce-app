const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/db");
const {
  errorResposerHandler,
  invalidPathHandler,
} = require("./middelware/errorHandlers");

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: [
      "X-TotalPagecount",
      "X-Pagesize",
      "X-CurrentPage",
      "X-Totalcount",
    ],
  })
);

// app.use((req, res, next) => {
//   // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, X-Custom-Header, Content-Type,X-TotalPagecount, Accept"
//   );
//   next();
// });

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routers
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const reviewRoute = require("./routes/reviewRoute");
const storeRoute = require("./routes/storeRoute");

//connectDB
connectDB();

//Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/store", storeRoute);

// //static assets
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// //errorHandlers
app.use(invalidPathHandler);
app.use(errorResposerHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
