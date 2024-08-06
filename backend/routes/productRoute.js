const express = require("express");
const {
  createProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProduct,
  searchProduct,
  reviewProduct,
  getProductReviews,
} = require("../controllers/productControllers");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");
const { upload } = require("../middelware/uploadPictureMiddelware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:slug", getProduct);
router.post(
  "/create",
  authGuard,
  adminGuard,
  upload.array("product", 4),
  createProduct
);
router.put(
  "/edit/:slug",
  authGuard,
  adminGuard,
  upload.array("product", 4),
  editProduct
);
router.delete("/delete/:id", authGuard, adminGuard, deleteProduct);
router.post("/:slug/review", authGuard, reviewProduct);
router.get("/:id/reviews",  getProductReviews);

module.exports = router;
