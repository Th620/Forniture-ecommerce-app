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
  productOnSale,
  getBestSellers,
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
router.put("/sale/:id", authGuard, adminGuard, productOnSale);
router.post("/:slug/review", authGuard, reviewProduct);
router.get("/:slug/reviews",authGuard, adminGuard, getProductReviews);
router.get("/store/bestsellers", getBestSellers);

module.exports = router;
