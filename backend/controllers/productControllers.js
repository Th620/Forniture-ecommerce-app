const Product = require("../models/Product");
const Review = require("../models/Review");
const Category = require("../models/Category");
const { fileRemover, fileterImagesToRemove } = require("../utils/fileRemover");
const {
  hasDuplicatesArrayOfObjectsTwoProprties,
  hasDuplicatesArrayOfStings,
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
    } = JSON.parse(req.body.document);

    if (!title) {
      throw new Error("product title is required");
    }

    const product = await Product.findOne({ slug: title.replace(/\s/g, "-") });

    if (product) {
      throw new Error("product exist");
    }

    var images = [];

    if (req.files) {
      const { files } = req;

      files.map((file) => {
        images.push(file.filename);
      });
    }

    if (!price) {
      throw new Error("product price is required");
    }
    if (!stock) {
      throw new Error("product stock is required");
    }

    const categories = await Category.find();

    var arrayOfCategories = [];

    categories.forEach((category) => {
      arrayOfCategories.push(category.name);
    });

    if (categories.length === 0) {
      const error = new Error("no category");
      error.statusCode = 404;
      return next(error);
    }

    if (!arrayOfCategories.includes(category)) {
      const error = new Error("category not fount");
      error.statusCode = 404;
      return next(error);
    }

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
      slug: title.toLowerCase().replace(/\s/g, "-"),
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
      images,
    } = JSON.parse(req.body.document);

    const product = await Product.findOne({ slug });

    var newImages = [...images];
    var addedImage = [];

    if (req.files) {
      const { files } = req;

      files.map((file) => {
        addedImage.push(file.filename);
        newImages.push(file.filename);
      });
    }

    if (!product) {
      const error = new Error("product not found");
      error.statusCode = 404;
      return next(error);
    }

    if (newImages.length > 4)
      throw new Error("you can't have more than 4 images for each product");

    const categories = await Category.find();

    var arrayOfCategories = [];

    categories.forEach((category) => {
      arrayOfCategories.push(category.name);
    });

    if (categories.length === 0) {
      const error = new Error("no category");
      error.statusCode = 404;
      return next(error);
    }

    if (!arrayOfCategories.includes(category)) {
      const error = new Error("category not fount");
      error.statusCode = 404;
      return next(error);
    }

    if (title === "") {
      throw new Error("product title is required");
    }
    if (price <= 0) {
      throw new Error("product price is required");
    }

    if (stock && stock <= 0) {
      throw new Error("product stock is required");
    }

    if (
      productInfo &&
      ((productInfo.desc && typeof productInfo.desc !== "string") ||
        (productInfo.features && !Array.isArray(productInfo.features)))
    )
      throw new Error("wrong product info structure");

    if (variations && !Array.isArray(variations))
      throw new Error("wrong structure");

    if (hasDuplicatesArrayOfObjectsTwoProprties(variations, "size", "color"))
      throw new Error("you can't add similar variation");

    const notAvailableVariation = variations.some((variation) => {
      return (
        !sizes.includes(variation.size) || !colors.includes(variation.color)
      );
    });

    if (notAvailableVariation) throw new Error("not available variation");

    if (
      colors &&
      (!Array.isArray(colors) || hasDuplicatesArrayOfStings(colors))
    )
      throw new Error("set correct colors");

    if (sizes && (!Array.isArray(sizes) || hasDuplicatesArrayOfStings(sizes)))
      throw new Error("set correct sizes");

    let previousImages = product.images;

    product.title = title?.trim() || product.title;
    product.slug = title?.toLowerCase().replace(/\s/g, "-") || product.slug;
    product.price = price || product.price;
    if (salePrice) product.salePrice = salePrice;
    product.category = category || product.category;
    product.productInfo = productInfo || product.productInfo;
    product.onSale = onSale || product.onSale;
    product.stock = stock || product.stock;
    product.colors = colors || product.colors;
    product.sizes = sizes || product.sizes;
    product.variations = variations || product.variations;

    product.images = newImages;

    const editedProduct = await product.save();
    let remove = fileterImagesToRemove(previousImages, images);
    fileRemover(remove);
    res.json(editedProduct);
  } catch (error) {
    if (req.files) fileRemover(addedImage);
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

    fileRemover(product.images);

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
      where.title = { $regex: searchKeyword, $options: "i" };
    }

    let sorting;

    if (category) {
      categoryFilter.category = category;
    }

    if (color) {
      variationsFilter.push({ $eq: ["$$item.color", color] });
    }

    if (size) {
      variationsFilter.push({ $eq: ["$$item.size", size] });
    }

    if (sort && parseInt(sort) !== 1 && parseInt(sort) !== -1)
      throw new Error("wrong sorting query");

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
          _id: 1,
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

    const finalProducts = products.sort(
      (a, b) => (b.price - a.price) * parseInt(sort)
    );

    const result = finalProducts.filter((product) => {
      if (variationsFilter.length > 0) {
        return product.variations.length !== 0;
      } else {
        return true;
      }
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug }).populate([
      {
        path: "reviews",
        match: { check: true },
        populate: [{ path: "user", select: ["firstName", "lastName"] }],
      },
    ]);

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
      product: product._id,
      content,
    });

    res.json(review);
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
