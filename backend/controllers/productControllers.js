const Product = require("../models/Product");
const Review = require("../models/Review");
const Store = require("../models/Store");
const { fileRemover } = require("../utils/fileRemover");
const {
  hasDuplicatesArrayOfObjectsTwoProprties,
} = require("../utils/hasDuplicates");

const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      price,
      salePrice,
      category,
      productInfo,
      onSale,
      stock,
      colors,
      sizes,
      variations,
    } = req.body;

    const product = await Product.findOne({ slug: title.replace(/\s/g, "-") });

    if (product) {
      throw new Error("product exist");
    }

    if (!categories.includes(category)) {
      const error = new Error("category not fount");
      error.statusCode = 404;
      return next(error);
    }

    var images = [];

    if (req.files) {
      const { files } = req;

      files.map((file) => {
        images.push(file.filename);
      });
    }

    if (!title) {
      throw new Error("product title is required");
    }
    if (!price) {
      throw new Error("product price is required");
    }
    if (!stock) {
      throw new Error("product stock is required");
    }

    const store = await Store.findOne();

    if (store) {
      const error = new Error("no store configured");
      error.statusCode = 404;
      return next(error);
    }

    const { categories } = store;

    if (hasDuplicatesArrayOfObjectsTwoProprties(variations, "size", "color"))
      throw new Error("you can't add similar variation");

    const notAvailableVariation = variations.some((variation) => {
      return (
        !sizes.includes(variation.size) || !colors.includes(variation.color)
      );
    });

    if (notAvailableVariation) throw new Error("not available variation");

    const newProduct = await Product.create({
      title,
      slug: title.replace(/\s/g, "-"),
      price,
      salePrice,
      category,
      productInfo,
      onSale,
      stock,
      colors,
      sizes,
      variations,
      images,
    });

    res.status(201).json({
      newProduct,
    });
  } catch (error) {
    if (req.files) fileRemover(images);
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    var images = [];

    if (req.files) {
      const { files } = req;

      files.map((file) => {
        images.push(file.filename);
      });
    }

    if (!product) {
      const error = new Error("product not found");
      error.statusCode = 404;
      return next(error);
    }

    let previousImages = product.images;

    const {
      title,
      price,
      salePrice,
      category,
      productInfo,
      onSale,
      stock,
      colors,
      sizes,
      variations,
    } = req.body;

    if (title === "") {
      throw new Error("product title is required");
    }
    if (price === 0) {
      throw new Error("product price is required");
    }

    if (hasDuplicatesArrayOfObjectsTwoProprties(variations, "size", "color"))
      throw new Error("you can't add similar variation");

    const notAvailableVariation = variations.some((variation) => {
      return (
        !sizes.includes(variation.size) || !colors.includes(variation.color)
      );
    });

    if (notAvailableVariation) throw new Error("not available variation");

    product.title = title?.trim() || product.title;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.category = category || product.category;
    product.productInfo = productInfo || product.productInfo;
    product.onSale = onSale || product.onSale;
    product.stock = stock || product.stock;
    product.colors = colors || product.colors;
    product.sizes = sizes || product.sizes;
    product.variations = variations || product.variations;

    product.images = images;

    const editedProduct = await product.save();
    fileRemover(previousImages);
    res.json(editedProduct);
  } catch (error) {
    if (req.files) fileRemover(images);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id });

    if (!product) {
      const error = Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      message: "product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { category, sort, size, color, searchKeyword } = req.query;

    let categoryFilter = {};
    let variationsFilter = [];
    let where = {};
    if (searchKeyword) {
      where.title = { $regex: "desk", $options: "i" };
    }

    let sorting;

    if (sort === "low to hight") {
      sorting = -1;
    } else {
      sorting = 1;
    }

    if (category) {
      categoryFilter.category = category;
    }

    if (color) {
      variationsFilter.push({ $eq: ["$$item.color", color] });
    }

    if (size) {
      variationsFilter.push({ $eq: ["$$item.size", size] });
    }

    const products = await Product.aggregate([
      { $match: { $and: [categoryFilter, where] } },
      {
        $project: {
          variations: {
            $filter: {
              input: "$variations",
              as: "item",
              cond: {
                $and: variationsFilter,
              },
            },
          },
          title: 1,
          slug: 1,
          price: 1,
          salePrice: 1,
          category: 1,
          productInfo: 1,
          onSale: 1,
          stock: 1,
          colors: 1,
          sizes: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    const finalProducts = products.sort((a, b) => sorting * (a - b));

    res.json(finalProducts);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const searchProduct = async (req, res, next) => {
  try {
    const filter = req.query.searchKeyword;
    let where = {};
    if (filter) {
      where.title = { $regex: "desk", $options: "i" };
    }

    const products = await Product.find(where);

    if (!products) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const reviewProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const { content } = req.body;

    const review = await Review.create({
      user: req.user,
      product: product.id,
      content,
    });

    res.json({ massage: "review added successfully" });
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const reviews = await Review.find({ product: product._id });

    res.json(reviews);
  } catch (error) {}
};

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProduct,
  searchProduct,
  reviewProduct,
  getProductReviews,
};
