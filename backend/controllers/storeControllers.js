const Category = require("../models/Category");
const Country = require("../models/Country");
const Store = require("../models/Store");
const State = require("../models/State");
const { fileRemoverSingleFile } = require("../utils/fileRemover");
const { existsArrayOfObjects } = require("../utils/exist");
const Product = require("../models/Product");

// category controllers
//   try {
//     const store = await Store.find();
//     if (store.length >= 1) throw new Error("store already available");
//     const { categories, countriesDetails } = req.body;

//     if (!categories || typeof categories !== "array")
//       throw new Error("categories are required");

//     if (hasDuplicatesArrayOfStings(categories))
//       throw new Error("you can't set two similar categories");

//     if (!countriesDetails || typeof countriesDetails !== "object")
//       throw new Error("countriesDetails are required");

//     if (hasDuplicatesArrayOfObjects(countriesDetails, "country"))
//       throw new Error("you can't set two similar countriesDetails");

//     for (let i = 0; i < countriesDetails.length; i++) {
//       if (hasDuplicatesArrayOfObjects(countriesDetails[i].state, "state")) {
//         throw new Error("you can't set two similar states in the same country");
//       }
//     }

//     let countries = [];

//     countriesDetails.map((country) => {
//       countries.push(country.country);
//     });

//     const admins = await User.find({ admin: true });
//     const newStore = await Store.create({
//       admins,
//       categories,
//       countriesDetails,
//       countries,
//     });

//     res.json(newStore);
//   } catch (error) {
//     next(error);
//   }
// };

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate([
      { path: "products", select: ["title"] },
    ]);

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug }).populate([
      { path: "products", select: ["title"] },
    ]);

    if (!category) {
      const error = Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    if (req.file) {
      var image = req.file.filename;
    }

    const { name } = req.body;

    if (!name || typeof name !== "string")
      throw new Error("no category to add");

    const categoryExist = await Category.findOne({ name: name.toLowerCase() });

    if (categoryExist) {
      throw new Error("category already exist");
    }

    const newCategory = await Category.create({
      name: name.toLowerCase(),
      slug: name.toLowerCase().replace(/\s/g, "-"),
      image,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    if (image) {
      fileRemoverSingleFile(image);
    }
    next(error);
  }
};

const editCategory = async (req, res, next) => {
  try {
    if (req.file) {
      var image = req.file.filename;
    }

    const { slug } = req.params;

    const categoryToEdit = await Category.findOne({ slug });

    if (!categoryToEdit) {
      const error = Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    const { name } = req.body;

    if (name && typeof name !== "string")
      throw new Error("that not a right category");

    if (name && name.toLowerCase() !== categoryToEdit.name) {
      const categoryExist = await Category.findOne({
        name: name.toLowerCase(),
      });

      if (categoryExist) {
        throw new Error("category already exist");
      }
    }

    categoryToEdit.name = name.toLowerCase() || categoryToEdit.name;
    categoryToEdit.image = image || categoryToEdit.image;
    if (name) {
      categoryToEdit.slug = name.toLowerCase().replace(/\s/g, "-");
    }

    const editedCategory = await categoryToEdit.save();

    res.json(editedCategory);
  } catch (error) {
    if (image) {
      fileRemoverSingleFile(image);
    }
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      const error = Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    const categoryProducts = await Product.updateMany(
      { category: category._id },
      { $unset: { category: 1 } },
      { multi: true }
    );

    // const newProducts = categoryProducts.map(async (product) => {
    //   product.category = "";
    //   await product.save();
    // });

    var image = category.image;

    if (category.image) {
      fileRemoverSingleFile(category.image);
    }

    res.json({ message: "category  deleted successfully" });
  } catch (error) {
    if (image) {
      fileRemoverSingleFile(image);
    }
    next(error);
  }
};

// countries and states Controllers

const getCountriesDetails = async (req, res, next) => {
  try {
    const countries = await Country.find().populate([
      { path: "states", select: ["state", "shippingFees"] },
      { path: "orders" },
    ]);

    // const states = await State.find().populate([{ path: "orders" }]);

    res.json(countries);
  } catch (error) {
    next(error);
  }
};

const getCountry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const country = await Country.findById(id).populate([
      {
        path: "states",
        select: ["state", "shippingFees"],
        populate: { path: "orders" },
      },
    ]);

    if (!country) {
      const error = Error("country not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(country);
  } catch (error) {
    next(error);
  }
};

const addCountry = async (req, res, next) => {
  try {
    const { country } = req.body;

    if (!country || typeof country !== "string")
      throw new Error("no country to add");

    const countryExist = await Country.findOne({
      country: country.toLowerCase(),
    });

    if (countryExist) throw new Error("country already exist");

    await Country.create({
      country: country.toLowerCase(),
    });

    res.status(201).json({ message: "country added successfully" });
  } catch (error) {
    next(error);
  }
};

const addState = async (req, res, next) => {
  try {
    const { countryId } = req.params;
    const { state, shippingFees } = req.body;

    if (!state || typeof state !== "string") throw new Error("no state to add");
    if (
      typeof parseFloat(shippingFees) !== "number" ||
      parseFloat(shippingFees) < 0
    )
      throw new Error("shipping fees are required");

    const country = await Country.findById(countryId);

    if (!country) {
      const error = Error("country not found");
      error.statusCode = 404;
      return next(error);
    }

    const stateExist = await State.findOne({ country: countryId, state });

    if (stateExist) {
      const error = Error("state already exist for this country");
      error.statusCode = 404;
      return next(error);
    }

    const newState = await State.create({
      country: country._id,
      state: state.toLowerCase(),
      shippingFees,
    });

    res.status(201).json(newState);
  } catch (error) {
    next(error);
  }
};

const deleteCountry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const country = await Country.findByIdAndDelete({ _id: id });

    if (!country) {
      const error = Error("country not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({ message: "country deletd successfully" });
  } catch (error) {
    next(error);
  }
};

const editCountry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { country } = req.body;

    if (country && typeof country !== "string")
      throw new Error("wrong country");

    const countryToEdit = await Country.findById(id);

    if (!countryToEdit) {
      const error = Error("country not found");
      error.statusCode = 404;
      return next(error);
    }

    if (country && country.toLowerCase() !== countryToEdit.country) {
      const countryExist = await Country.findOne({
        country: country.toLowerCase(),
      });

      if (countryExist) {
        throw new Error("country already exist");
      }
    }

    countryToEdit.country = country.toLowerCase() || countryToEdit.country;

    await countryToEdit.save();

    res.json({ message: "country edited successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteState = async (req, res, next) => {
  try {
    const { stateId } = req.params;

    const state = await State.findByIdAndDelete(stateId);

    if (!state) {
      const error = Error("country not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({ message: "state deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const editState = async (req, res, next) => {
  try {
    const { stateId } = req.params;
    const { state, shippingFees } = req.body;

    if (state && typeof state !== "string") throw new Error("wrong state");
    if (shippingFees && parseFloat(shippingFees) < 0)
      throw new Error("shipping must be greater or equal to 0");

    const stateExist = await State.findById(stateId);

    if (!stateExist) {
      throw new Error("state already exist");
    }

    if (state && state.toLowerCase() !== stateExist.state) {
      const stateExistInCountry = await State.findOne({
        state: state.toLowerCase(),
        country: stateExist.country,
      });

      if (stateExistInCountry)
        throw new Error("state already exist in this country");
    }

    stateExist.state = state.toLowerCase() || stateExist.state;
    stateExist.shippingFees = shippingFees || stateExist.shippingFees;

    const editState = await stateExist.save();

    res.json(editState);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCountriesDetails,
  addCategory,
  editCategory,
  getCategory,
  deleteCategory,
  addCountry,
  getCountry,
  editCountry,
  addState,
  deleteCountry,
  deleteState,
  editState,
};
