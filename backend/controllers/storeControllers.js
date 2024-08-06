const Store = require("../models/Store");

const getCategories = async (req, res, next) => {
  try {
    const store = await Store.findOne();

    if (store.length === 0) {
      const error = Error("store not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(store.categories);
  } catch (error) {
    next(error);
  }
};

const getCountries = async (req, res, next) => {
  try {
    const store = await Store.findOne();

    if (store.length === 0) {
      const error = Error("store not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(store.countries);
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const store = await Store.findOne();

    if (!store) {
      const error = Error("store not found");
      error.statusCode = 404;
      return next(error);
    }

    const { category } = req.body;

    if (!category) throw new Error("no category to add");

    if (store.categories.includes(category))
      throw new Error("category already exists");

    store.categories.push(category);

    const updatedStore = await store.save();

    res.json(updatedStore.categories);
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

    if (!country || !states || states.length === 0)
      throw new Error("no country to add");

    const exist = store.countries.filter((item) => {
      return item.country === country;
    });
    console.log(exist);

    if (!(exist.length == 0)) throw new Error("country already exists");

    store.countries.push({ country, states });

    const updatedStore = await store.save();

    res.json(updatedStore.countries);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCountries, addCategory, addCountry };
