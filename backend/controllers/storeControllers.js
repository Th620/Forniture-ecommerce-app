const Store = require("../models/Store");

const getCategories = async (req, res, next) => {
  try {
    await Store.create({
      countries: {
        country: "country",
        states: [
          {
            state: "state",
            shippingFee: 10,
          },
        ],
      },
      categories: ["sofas", "lamps", "chairs"],
    });
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

    if (!country || states.length === 0 || !states)
      throw new Error("no country to add");

    states.map((item) => {
      if (!item.state) throw new Error("you must add the name of every state");
      if (!item.shippingFee)
        throw new Error("you must add the shipping fee of every state");
    });

    const existCountry = store.countries.filter((item) => {
      return item.country === country;
    });

    if (!(existCountry.length == 0)) throw new Error("country already exists");

    for (let j = 0; j < states.length - 1; j++) {
      for (let i = j + 1; i < states.length; i++) {
        if (states[i].state === states[j].state)
          throw new Error("there is a duplicated state");
      }
    }

    store.countries.push({ country, states });

    const updatedStore = await store.save();

    res.json(updatedStore.countries);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCountries, addCategory, addCountry };
