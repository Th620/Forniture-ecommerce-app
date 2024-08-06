const express = require("express");
const { authGuard, adminGuard } = require("../middelware/authMiddelware");
const {
  getCategories,
  getCountries,
  addCategory,
  addCountry,
} = require("../controllers/storeControllers");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/countries", getCountries);
router.put("/categories/add", authGuard, adminGuard, addCategory);
router.put("/countries/add", authGuard, adminGuard, addCountry);

module.exports = router;
