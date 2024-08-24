const Category = require("../models/Category");
const Store = require("../models/Store");
const {
  hasDuplicatesArrayOfStings,
  hasDuplicatesArrayOfObjects,
} = require("../utils/hasDuplicates");

const createStore = async (req, res, next) => {
  try {
    const store = await Store.find();
    if (store.length >= 1) throw new Error("store already available");
    const { categories, countriesDetails } = req.body;

    if (!categories || typeof categories !== "array")
      throw new Error("categories are required");

    if (hasDuplicatesArrayOfStings(categories))
      throw new Error("you can't set two similar categories");

    if (!countriesDetails || typeof countriesDetails !== "object")
      throw new Error("countriesDetails are required");

    if (hasDuplicatesArrayOfObjects(countriesDetails, "country"))
      throw new Error("you can't set two similar countriesDetails");

    for (let i = 0; i < countriesDetails.length; i++) {
      if (hasDuplicatesArrayOfObjects(countriesDetails[i].state, "state")) {
        throw new Error("you can't set two similar states in the same country");
      }
    }

    let countries = [];

    countriesDetails.map((country) => {
      countries.push(country.country);
    });

    const admins = await User.find({ admin: true });
    const newStore = await Store.create({
      admins,
      categories,
      countriesDetails,
      countries,
    });

    res.json(newStore);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      const error = Error("Categories not found");
      error.statusCode = 404;
      return next(error);
    }

    var array = [];

    categories.forEach((category) => {
      array.push(category.name);
    });

    res.json(array);
  } catch (error) {
    next(error);
  }
};

const getCountriesDetails = async (req, res, next) => {
  try {
    const store = await Store.findOne();

    if (store.length === 0) {
      const error = Error("store not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(store.countriesDetails);
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category || typeof category !== "string")
      throw new Error("no category to add");

    const categories = await Category.find();

    var array = [];

    categories.forEach((category) => {
      array.push(category.name.toLowerCase());
    });

    if (array.includes(category.toLowerCase()))
      throw new Error("category already exists");

    const newCategory = await Category.create({
      name: category,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const addCountry = async (req, res, next) => {
  try {
    const store = await Store.findOne();

    if (!store) {
      const error = Error("store not found");
      error.statusCode = 404;
      return next(error);
    }

    const { country, states } = req.body;

    if (!country || states.length === 0 || !states)
      throw new Error("no country to add");

    states.map((item) => {
      if (!item.state) throw new Error("you must add the name of every state");
      if (!item.shippingFee)
        throw new Error("you must add the shipping fee of every state");
    });

    const existCountry = store.countriesDetails.filter((item) => {
      return item.country === country;
    });

    if (!(existCountry.length == 0)) throw new Error("country already exists");

    if (hasDuplicatesArrayOfObjects(states, "state"))
      throw new Error("there is duplicated state");

    store.countriesDetails.push({ country, states });

    store.countries.push(country);

    const updatedStore = await store.save();

    res.json(updatedStore.countriesDetails);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStore,
  getCategories,
  getCountriesDetails,
  addCategory,
  addCountry,
};
