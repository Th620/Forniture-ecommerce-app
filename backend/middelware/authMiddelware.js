const { verify } = require("jsonwebtoken");
const User = require("../models/User");

// const authGuard = async (req, res, next) => {
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       const token = req.headers.authorization.split(" ")[1];
//       const { id } = verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(id).select("-password");
//       next();
//     } catch (error) {
//       const err = new Error("Not Authorized, Token failed");
//       err.statusCode = 401;
//       next(err);
//     }
//   } else {
//     const error = new Error("Not Authorized, No Token");
//     error.statusCode = 401;
//     next(error);
//   }
// };

const authGuard = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(req.cookies);

  console.log(token);

  if (token) {
    try {
      const { id } = verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select("-password");
      next();
    } catch (error) {
      const err = new Error("Not Authorized, Token failed");
      err.statusCode = 401;
      next(err);
    }
  } else {
    const error = new Error("Not Authorized, No Token");
    error.statusCode = 401;
    next(error);
  }
};

const adminGuard = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    const error = new Error("Not authorized as an Admin");
    error.statusCode = 401;
    next(error);
  }
};

module.exports = { authGuard, adminGuard };
