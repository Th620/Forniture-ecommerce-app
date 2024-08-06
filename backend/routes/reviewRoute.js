const express = require("express");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");
const { getReviews, checkReview, deleteReview } = require("../controllers/reviewController");

const router = express.Router();

router.get("/", authGuard, adminGuard, getReviews);
router.put("/check/:id", authGuard, adminGuard, checkReview);
router.delete("/delete/:id", authGuard, adminGuard, deleteReview);

module.exports = router;
