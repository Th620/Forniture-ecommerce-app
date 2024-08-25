const express = require("express");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");
const {
  getCategories,
  addCategory,
  addCountry,
  getCountriesDetails,
  createStore,
  editCategory,
} = require("../controllers/storeControllers");
const { upload } = require("../middelware/uploadPictureMiddelware");

const router = express.Router();

router.get("/", authGuard, adminGuard, createStore);
router.get("/categories", getCategories);
router.get("/countries", getCountriesDetails);
router.post(
  "/categories/add",
  authGuard,
  adminGuard,
  upload.single("category"),
  addCategory
);
router.put(
  "/categories/edit/:id",
  authGuard,
  adminGuard,
  upload.single("category"),
  editCategory
);
router.post("/countries/add", authGuard, adminGuard, addCountry);

module.exports = router;
