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

    if (typeof onSale !== "boolean" && onSale)
      throw new Error("Invalid data type 'onSale");

    if (
      onSale &&
      (!JSON.stringify(salePrice) ||
        typeof +salePrice !== "number" ||
        +salePrice >= +price)
    )
      throw new Error("Invalid sale price");

    if (!stock) {
      throw new Error("product stock is required");
    }

    if (!category || typeof category !== "string")
      throw new Error("category is required");

    const categoryExist = await Category.findOne({ name: category });

    if (!categoryExist) {
      const error = new Error("category not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      colors &&
      (!Array.isArray(colors) || hasDuplicatesArrayOfStings(colors))
    )
      throw new Error("set correct colors");

    if (sizes && (!Array.isArray(sizes) || hasDuplicatesArrayOfStings(sizes)))
      throw new Error("set correct sizes");

    const finalColors = colors.map((color) => {
      return color.toLowerCase();
    });

    const finalSizes = sizes.map((size) => {
      return size.toLowerCase();
    });

    if (variations && !Array.isArray(variations))
      throw new Error("wrong structure");

    if (hasDuplicatesArrayOfObjectsTwoProprties(variations, "size", "color"))
      throw new Error("you can't add similar variation");

    const notAvailableVariation = variations.some((variation) => {
      return (
        !finalSizes.includes(variation.size.toLowerCase()) ||
        !finalColors.includes(variation.color.toLowerCase())
      );
    });

    if (notAvailableVariation) throw new Error("not available variation");

    const newProduct = await Product.create({
      title,
      slug: title.toLowerCase().replace(/\s/g, "-"),
      price,
      salePrice: onSale ? salePrice : price,
      category: categoryExist._id,
      productInfo,
      onSale: onSale || false,
      stock,
      colors: finalColors,
      sizes: finalSizes,
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

    var newImages = [];

    if (images) {
      newImages = [...images];
    }
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

    if (category && typeof category !== "string")
      throw new Error("wrong category");

    if (category) {
      var categoryExist = await Category.findOne({ name: category });

      if (!categoryExist) {
        const error = new Error("category not found");
        error.statusCode = 404;
        return next(error);
      }
    }

    if (title === "") {
      throw new Error("product title is required");
    }
    if (price && (typeof +price !== "number" || price <= 0)) {
      throw new Error("product price is required");
    }

    if (JSON.stringify(stock) && (typeof +stock !== "number" || stock < 0)) {
      throw new Error("product stock is required");
    }

    if (onSale && typeof onSale !== "boolean") throw new Error("Invalid type");

    if (
      onSale &&
      salePrice &&
      (typeof +salePrice !== "number" || salePrice < 0)
    )
      throw new Error("Invalid sale Price price");

    if (onSale && !salePrice) throw new Error("Set a sale price");

    if (
      (onSale && price && salePrice && salePrice >= price) ||
      (onSale && !price && salePrice && salePrice >= product.price)
    )
      throw new Error("Sale price must be less than the original price");

    if (
      productInfo &&
      ((productInfo.desc && typeof productInfo.desc !== "string") ||
        (productInfo.features && !Array.isArray(productInfo.features)))
    )
      throw new Error("wrong product info structure");

    if (
      colors &&
      (!Array.isArray(colors) || hasDuplicatesArrayOfStings(colors))
    )
      throw new Error("set correct colors");

    if (sizes && (!Array.isArray(sizes) || hasDuplicatesArrayOfStings(sizes)))
      throw new Error("set correct sizes");

    if (colors) {
      var finalColors = colors.map((color) => {
        return color.toLowerCase();
      });
    }

    if (sizes) {
      var finalSizes = sizes.map((size) => {
        return size.toLowerCase();
      });
    }

    if (variations && !Array.isArray(variations))
      throw new Error("wrong structure");

    if (
      variations &&
      hasDuplicatesArrayOfObjectsTwoProprties(variations, "size", "color")
    )
      throw new Error("you can't add similar variation");

    if (variations) {
      var notAvailableVariation = variations.some((variation) => {
        return (
          !finalSizes.includes(variation.size.toLowerCase()) ||
          !finalColors.includes(variation.color.toLowerCase())
        );
      });
    }

    if (notAvailableVariation) throw new Error("not available variation");

    let previousImages = product.images;

    product.title = title?.trim() || product.title;
    product.slug = title?.toLowerCase().replace(/\s/g, "-") || product.slug;
    product.price = price || product.price;
    if (onSale) product.salePrice = salePrice || product.salePrice;
    if (!onSale) product.salePrice = price || product.price;
    product.productInfo = productInfo || product.productInfo;
    if (onSale) {
      product.onSale = true;
    } else {
      product.onSale = false;
    }
    product.colors = finalColors || product.colors;
    product.sizes = finalSizes || product.sizes;
    product.variations = variations || product.variations;

    if (categoryExist) {
      product.category = categoryExist._id;
    }

    if (newImages.length > 0) {
      product.images = newImages;
    }

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

    await Review.deleteMany({ product: product });

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

    let where = {};
    if (searchKeyword) {
      where.title = { $regex: searchKeyword, $options: "i" };
    }

    if (category) {
      var categoryExist = await Category.find({ name: category.toLowerCase() });
    }

    if (category && !categoryExist) {
      const err = Error("category not found");
      err.statusCode = 404;
      next(err);
    }

    if (categoryExist) {
      where.category = categoryExist;
    }

    if (color) {
      where = { ...where, "variations.color": color.toLowerCase() };
    }

    if (size) {
      where = { ...where, "variations.size": size.toLowerCase() };
    }

    if (sort && parseInt(sort) !== 1 && parseInt(sort) !== -1)
      throw new Error("wrong sorting query");

    let sorting = [["createdAt", 1]];

    if (sort) {
      sorting = [["salePrice", +sort || 1]];
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = req.query.pageSize || 16;

    const total = await Product.find(where).countDocuments();

    if (total) {
      var pages = Math.ceil(total / pageSize);
    }
    const skip = (page - 1) * pageSize;

    if (pages && page > pages) {
      throw new Error("page not available");
    }

    res.header({
      "X-Totalcount": JSON.stringify(total),
      "X-CurrentPage": JSON.stringify(page),
      "X-Pagesize": JSON.stringify(pageSize),
      "X-TotalPagecount": JSON.stringify(pages),
    });

    const products = await Product.find(where)
      .skip(skip)
      .limit(pageSize)
      .sort(sorting);

    res.json(products);
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
      { path: "category", select: ["name"] },
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

    if (!content) throw new Error("you can't add an empty review");

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
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = req.query.pageSize || 7;

    const total = await Review.find({ product: product._id }).countDocuments();

    if (total) {
      var pages = Math.ceil(total / pageSize);
    }
    const skip = (page - 1) * pageSize;

    if (pages && page > pages) {
      throw new Error("page not available");
    }

    res.header({
      "X-Totalcount": JSON.stringify(total),
      "X-CurrentPage": JSON.stringify(page),
      "X-Pagesize": JSON.stringify(pageSize),
      "X-TotalPagecount": JSON.stringify(pages),
    });

    const reviews = await Review.find({ product: product._id })
      .skip(skip)
      .limit(pageSize)
      .populate([{ path: "user", select: ["firstName", "lastName"] }]);

    res.json({ product: product.title, reviews });
  } catch (error) {}
};

const productOnSale = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { salePrice } = re.body;

    const product = await Product.findById(id);

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!salePrice || typeof salePrice !== "number" || salePrice < 0)
      throw new Error("Invalid price");

    product.onSale = true;
    product.salePrice = salePrice;

    await product.save();

    res.json({ message: "sale price set successfully" });
  } catch (error) {}
};

const getBestSellers = async (req, res, next) => {
  try {
    const { category } = req.query;

    let where = {};

    if (category) {
      var categoryExist = await Category.findOne({
        name: category.toLowerCase(),
      });

      if (!categoryExist) {
        const err = Error("category not found");
        err.statusCode = 404;
        return next(err);
      }
    }

    if (categoryExist) {
      where.category = categoryExist;
    }

    const products = await Product.find(where)
      .sort([["sales", 1]])
      .limit(8);
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
  reviewProduct,
  getProductReviews,
  productOnSale,
  getBestSellers,
};
