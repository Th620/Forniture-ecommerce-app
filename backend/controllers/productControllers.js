const { uploadPicture } = require("../middelware/uploadPictureMiddelware");
const Product = require("../models/Product");
const { fileRemover } = require("../utils/fileRemover");

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

    if (!title) throw new Error("product title is required");
    if (!price) throw new Error("product price is required");
    if (!stock) throw new Error("product stock is required");

    const product = await Product.findOne({ slug: title.replace(/\s/g, "-") });

    if (product) throw new Error("product exist");

    if (req.file) {
      var image = req.file.filename;
    } else {
      image = "";
    }

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
      image,
    });

    res.status(201).json({
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const editProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) throw new Error("product not found");

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

    if (!title) throw new Error("product title is required");
    if (!price) throw new Error("product price is required");
    if (!stock) throw new Error("product stock is required");

    if (product.image) fileRemover(product.image);

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
    product.image = req?.file?.filename || "";

    const editedProduct = await product.save();
    res.json({ editedProduct });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOneAndDelete({ slug });

    if (!product) {
      const error = Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      message: "product deleted",
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
          image: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!products) {
      const error = Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

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

module.exports = {
  createProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProduct,
  searchProduct,
};
