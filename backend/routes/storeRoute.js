const express = require("express");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");
const {
  getCategories,
  addCategory,
  addCountry,
  getCountriesDetails,
} = require("../controllers/storeControllers");

const router = express.Router();

router.get("/", authGuard, adminGuard, getCategories);
router.get("/categories", getCategories);
router.get("/countries", getCountriesDetails);
router.put("/categories/add", authGuard, adminGuard, addCategory);
router.put("/countries/add", authGuard, adminGuard, addCountry);

module.exports = router;
