const express = require("express");
const {
  createProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProduct,
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
  upload.single("product"),
  createProduct
);
router.put(
  "/edit/:slug",
  authGuard,
  adminGuard,
  upload.single("product"),
  editProduct
);
router.delete("/delete/:slug", authGuard, adminGuard, deleteProduct);

module.exports = router;
