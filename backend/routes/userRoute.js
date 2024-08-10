const express = require("express");
const {
  register,
  login,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/userControllers");
const { authGuard } = require("../middelware/authMiddelware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authGuard, logout);
router.get("/profile", authGuard, profile);
router.put("/updateProfile", authGuard, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;
