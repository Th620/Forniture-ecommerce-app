const express = require("express");
const {
  register,
  login,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
  logout,
  updateUserRole,
} = require("../controllers/userControllers");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authGuard, logout);
router.get("/profile", authGuard, profile);
router.put("/updateProfile", authGuard, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.put("/updateUser/:id", authGuard, adminGuard, updateUserRole);

module.exports = router;
