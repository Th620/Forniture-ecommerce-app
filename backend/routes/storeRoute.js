const express = require("express");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");
const {
  getCategories,
  addCategory,
  addCountry,
  getCountriesDetails,
  editCategory,
  addState,
  deleteState,
  deleteCategory,
  editCountry,
  deleteCountry,
  editState,
  getCategory,
  getCountry,
} = require("../controllers/storeControllers");
const { upload } = require("../middelware/uploadPictureMiddelware");

const router = express.Router();

// categories route

router.get("/categories",  getCategories);
router.get("/categories/:slug", authGuard, adminGuard, getCategory);

router.post(
  "/categories/add",
  authGuard,
  adminGuard,
  upload.single("category"),
  addCategory
);
router.put(
  "/categories/edit/:slug",
  authGuard,
  adminGuard,
  upload.single("category"),
  editCategory
);
router.delete("/categories/delete/:id", authGuard, adminGuard, deleteCategory);

// countries route
router.get("/countries", getCountriesDetails);
router.post("/countries/add", authGuard, adminGuard, addCountry);
router.get("/countries/:id", getCountry);
router.put("/countries/edit/:id", authGuard, adminGuard, editCountry);
router.delete("/countries/delete/:id", authGuard, adminGuard, deleteCountry);
router.post("/countries/:countryId/add", authGuard, adminGuard, addState);
router.delete(
  "/countries/states/delete/:stateId",
  authGuard,
  adminGuard,
  deleteState
);

router.put("/countries/states/edit/:stateId", authGuard, adminGuard, editState);

module.exports = router;
