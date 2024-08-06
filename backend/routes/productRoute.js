const express = require("express");
const {
  createProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProduct,
  searchProduct,
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
router.delete("/delete/:slug", authGuard, adminGuard, deleteProduct);

module.exports = router;
