const Item = require("../models/Item");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Country = require("../models/Country");
const State = require("../models/State");
const User = require("../models/User");

const unavailableSize = (variations = [], color, size) => {
  return variations.every((variation) => {
    return (
      color &&
      size &&
      (variation.color !== color ||
        variation.size !== size ||
        variation.stock <= 0)
    );
  });
};

const unavailableColor = (variations = [], color) => {
  return variations.every((variation) => {
    return (
      color &&
      (variation.color !== color ||
        (variation.color === color && variation.stock <= 0))
    );
  });
};

const newOrder = async (req, res, next) => {
  try {
    const { products, city, country, state, address } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0)
      throw new Error("you can't place an empty order");

    if (
      !city ||
      typeof city !== "string" ||
      !state ||
      typeof state !== "string" ||
      !address ||
      typeof address !== "string" ||
      !country ||
      typeof country !== "string"
    )
      throw new Error("invalid shipping information");

    const countryExist = await Country.findById(country);
    if (!countryExist) {
      const error = Error("country not found");
      error.statusCode = 404;
      return next(error);
    }

    const stateExist = await State.findOne({
      _id: state,
      country: countryExist._id,
    });
    if (!stateExist) {
      const error = Error("state not found");
      error.statusCode = 404;
      return next(error);
    }

    for (let item of products) {
      try {
        const product = await Product.findById(item._id);

        if (!product) {
          const error = Error("product not found");
          error.statusCode = 404;
          throw new Error(error);
        }

        if (
          !item.color ||
          !typeof item.color === "string" ||
          !product.colors.includes(item.color.toLowerCase()) ||
          !item.size ||
          !typeof item.size === "string" ||
          !product.sizes.includes(item.size.toLowerCase())
        ) {
          throw new Error(
            "you should select a color and size for each product"
          );
        }

        if (!item.quantity) {
          item.quantity = 1;
        }

        if (product.stock - item.quantity < 0) {
          throw new Error("The requested quantity exceeds our current stock");
        }
        if (unavailableColor(product.variations, item.color.toLowerCase())) {
          throw new Error("unavailable color and size combination");
        }
        if (unavailableSize(product.variations, item.color, item.size)) {
          throw new Error("unavailable color and size combination");
        }
        const variation = product.variations.find((e) => {
          return (
            e.color === item?.color.toLowerCase() &&
            e.size === item?.size.toLowerCase()
          );
        });

        if (!variation) {
          throw new Error("variation not found");
        }
        if (variation.stock - item.quantity < 0) {
          throw new Error(
            "The requested quantity exceeds our current stock. Select another color or size"
          );
        }
      } catch (error) {
        return next(error);
      }
    }

    for (const item of products) {
      try {
        const product = await Product.findById(item._id);
        product.stock = product.stock - item.quantity;
        const variation = product.variations.find((e) => {
          return (
            e.color === item?.color.toLowerCase() &&
            e.size === item?.size.toLowerCase()
          );
        });
        const index = product.variations.indexOf(variation);
        product.variations[index].stock =
          product.variations[index].stock - item.quantity;
        product.sales = product.sales + item.quantity;
        await product.save();
      } catch (error) {
        return next(error);
      }
    }

    const order = await Order.create({
      client: req.user._id,
      shipping: {
        country,
        state,
        city,
        address,
      },
      shippingFees: stateExist.shippingFees,
    });

    for (let product of products) {
      try {
        const item = await Item.findOne({
          product: product._id,
          order: order._id,
          color: product.color,
          size: product.size,
        });
        if (item) {
          item.quantity++;
          await item.save();
        } else {
          await Item.create({
            product: product._id,
            order: order._id,
            color: product.color,
            size: product.size,
            quantity: product?.quantity || 1,
          });
        }
      } catch (error) {
        return next(error);
      }
    }
    const finalOrder = await Order.findById(order._id).populate([
      {
        path: "products",
        populate: [{ path: "product", select: ["price"] }],
      },
      {
        path: "client",
        select: ["firstName", "lastName", "price", "email", "phone"],
      },
      {
        path: "shipping",
        populate: [
          {
            path: "country",
            select: ["country"],
          },
          {
            path: "state",
            select: ["state", "shippingFees"],
          },
        ],
      },
    ]);

    res.status(201).json(finalOrder);
  } catch (error) {
    next(error);
  }
};

const editOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      const error = Error("order not found");
      error.statusCode = 404;
      return next(error);
    }
    if (order.status === "confirmed" || order.status === "delivered")
      throw new Error("you can't edit the order after it was " + order.status);

    const { products, city, country, state, address } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0)
      throw new Error("you can't place an empty order");

    const items = await Item.find({ order: order._id });

    var editedProducts = [];

    products.forEach(async (product) => {
      const result = items.every((item) => {
        console.log(item);
        console.log(product);
        console.log(objectid);

        return item._id !== product._id;
      });

      console.log(result);

      if (result) {
        await Item.findByIdAndDelete(product._id);
      } else {
        const p = await Product.findById(product.product);
        console.log(p);

        if (!p) {
          const error = Error("product not found");
          error.statusCode = 404;
          return next(error);
        }
        if (p.stock - product.quantity < 0) {
          const err = Error("The requested quantity exceeds our current stock");
          return next(err);
        }
        const variation = p.variations.find((e) => {
          return e.color === product.color && e.size === product.size;
        });
        if (variation.stock - product.quantity < 0) {
          const err = Error(
            "The requested quantity exceeds our current stock. Select another color or size"
          );
          return next(err);
        }
        editedProducts.push(product);
      }
    });

    if (editedProducts.length === 0)
      throw new Error("you can't place an empty order");

    if (
      (city && typeof city !== "string") ||
      (state && typeof state !== "string") ||
      (address && typeof address !== "string") ||
      (country && typeof country !== "string")
    )
      throw new Error("invalid shipping information");

    if (country) {
      var countryExist = await Country.findById(country);
      if (!countryExist) {
        const error = Error("country not found");
        error.statusCode = 404;
        return next(error);
      }
    }

    if (state) {
      var stateExist = await State.findOne({
        _id: state,
        country: countryExist._id,
      });
      if (!stateExist) {
        const error = Error("state not found");
        error.statusCode = 404;
        return next(error);
      }
    }

    if (products) {
      order.products = editedProducts;
    }
    order.shipping.country = country || order.shipping.country;
    order.shipping.state = state || order.shipping.state;
    order.shipping.city = city || order.shipping.city;
    order.shipping.address = address || order.shipping.address;
    order.shippingFees = stateExist.shippingFees || order.shippingFees;

    const editedOrder = await order.save();
    res.json(editedOrder);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      const error = Error("order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      order.status === "confirmed" ||
      order.status === "delivered" ||
      order.status === "canceled"
    )
      throw new Error(
        "you can't cancel the order after it was " + order.status
      );

    const items = await Item.find({ order: order._id });

    for (const item of items) {
      try {
        const product = await Product.findById(item.product);
        if (!product) {
          const error = Error("product not found");
          error.statusCode = 404;
          throw new Error(error);
        }
        product.stock = product.stock + item.quantity;
        const variation = product.variations.find((v) => {
          return item.color === v.color && item.size === v.size;
        });
        variation.stock = variation.stock + item.quantity;
        await product.save();
      } catch (error) {
        return next(error);
      }
    }

    order.status = "canceled";

    await order.save();

    res.json({
      message: "order canceled successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    var where = {};

    if (
      status === "pending" ||
      status === "confirmed" ||
      status === "canceled" ||
      status === "dilevered"
    ) {
      where.status = status;
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;

    const total = await Order.find({
      client: req.user,
      ...where,
    }).countDocuments();

    var pages = 0;if (total) {
      pages = Math.ceil(total / pageSize);
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

    const orders = await Order.find({ client: req.user, ...where })
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "products",
          populate: [{ path: "product", select: ["price"] }],
        },
      ])
      .sort({ createdAt: "desc" });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { country, status, user, period, state } = req.query;
    var where = {};
    if (country) {
      where = { "shipping.country": country };
    }
    if (state) {
      where = { "shipping.state": state };
    }
    if (
      status === "pending" ||
      status === "confirmed" ||
      status === "canceled" ||
      status === "delivered"
    ) {
      where.status = status;
    }
    if (user) {
      where.client = user;
    }

    const date = new Date();

    switch (period) {
      case "today":
        var startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        var endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        where.createdAt = {
          $gte: startOfDay,
          $lt: endOfDay,
        };
        break;
      case "this week":
        var startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        where.createdAt = {
          $gte: startOfWeek,
        };
        break;
      case "this month":
        var startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        where.createdAt = {
          $gte: startOfMonth,
        };
        break;
      case "this year":
        var startOfYear = new Date();
        startOfYear.setMonth(0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        where.createdAt = {
          $gte: startOfYear,
        };
        break;
      default:
        break;
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;

    const total = await Order.find(where).countDocuments();

    var pages = 0;if (total) {
      pages = Math.ceil(total / pageSize);
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

    const orders = await Order.find(where)
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "products",
          populate: [{ path: "product", select: ["price"] }],
        },
        {
          path: "shipping",
          populate: [
            {
              path: "country",
              select: ["country"],
            },
            {
              path: "state",
              select: ["state", "shippingFees"],
            },
          ],
        },
      ])
      .sort({ createdAt: "desc" });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.admin) {
      var order = await Order.findById(id).populate([
        {
          path: "products",
          select: ["quantity", "color", "size", "product"],
          populate: [
            {
              path: "product",
              select: ["price", "title", "images", "slug"],
            },
          ],
        },
        {
          path: "client",
          select: ["firstName", "lastName", "email", "phone"],
        },
      ]);
    } else {
      var order = await Order.findOne({ _id: id, client: req.user }).populate([
        {
          path: "products",
          select: ["quantity", "color", "size", "product"],
          populate: [
            {
              path: "product",
              select: ["price", "title", "images", "slug"],
            },
          ],
        },
        {
          path: "client",
          select: ["firstName", "lastName", "email", "phone"],
        },
      ]);
    }

    if (!order) {
      const error = Error("order not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const confirmOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      const error = Error("order not found");
      error.statusCode = 404;
      return next(error);
    }
    order.status = "confirmed";

    await order.save();

    res.json({ message: "order confirmed successfully" });
  } catch (error) {
    next(error);
  }
};

const markOrderAsDelivered = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      const error = Error("order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (order.status === "canceled")
      throw new Error(
        "you can't set order as delivered after it was cansceled"
      );
    order.status = "delivered";

    await order.save();

    res.json({ message: "order confirmed successfully" });
  } catch (error) {
    next(error);
  }
};

const getSoldProductNumberAndProfits = async (req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: startOfMonth,
      },
    })
      .populate([
        {
          path: "products",
          populate: [{ path: "product", select: ["price"] }],
        },
      ])
      .sort({ updatedAt: "desc" });

    const productSold = orders.reduce(
      (total, order) =>
        total +
        order.products.reduce((total, product) => total + product.quantity, 0),
      0
    );
    const profits = orders.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastMounthStart = new Date();
    lastMounthStart.setMonth(lastMounthStart.getMonth() - 1);
    lastMounthStart.setDate(1);
    lastMounthStart.setHours(0, 0, 0, 0);

    const LastMonthOrders = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: lastMounthStart,
        $lt: startOfMonth,
      },
    })
      .populate([
        {
          path: "products",
          populate: [{ path: "product", select: ["price"] }],
        },
      ])
      .sort({ updatedAt: "desc" });

    const productSoldLastMonth = LastMonthOrders.reduce(
      (total, order) =>
        total +
        order.products.reduce((total, product) => total + product.quantity, 0),
      0
    );

    const lastMonthProfits = LastMonthOrders.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const profitsPercentage = 100 - (lastMonthProfits * 100) / profits;
    const productSlodPercentage =
      100 - (productSoldLastMonth * 100) / productSold;

    const ordersPercentage =
      100 - (LastMonthOrders.length * 100) / orders.length;

    const customers = await User.find().populate([
      { path: "orders", select: ["createdAt"] },
    ]);

    const customersThisMounth = customers.filter((customer) => {
      return (
        customer.orders.length > 0 &&
        customer.orders.some((order) => {
          return order.createdAt > startOfMonth;
        })
      );
    });

    const customersLastMounth = customers.filter((customer) => {
      return (
        customer.orders.length > 0 &&
        customer.orders.some((order) => {
          return (
            order.createdAt > lastMounthStart && order.createdAt < startOfMonth
          );
        })
      );
    });

    const customerPercentage =
      100 - (customersLastMounth.length * 100) / customersThisMounth.length;

    res.json({
      profits,
      productSold,
      profitsPercentage,
      productSlodPercentage,
      orders: orders.length,
      ordersPercentage,
      customers: customersThisMounth.length,
      customerPercentage,
    });
  } catch (error) {
    next(error);
  }
};

const getEarnings = async (req, res, next) => {
  try {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const jan = await Order.find({
      createdAt: {
        $gte: date.setMonth(0, 1),
        $lt: date.setMonth(1, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const janEarn = jan.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const feb = await Order.find({
      createdAt: {
        $gte: date.setMonth(1, 1),
        $lt: date.setMonth(2, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const febEarn = feb.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const mar = await Order.find({
      createdAt: {
        $gte: date.setMonth(2, 1),
        $lt: date.setMonth(3, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const marEarn = mar.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const apr = await Order.find({
      createdAt: {
        $gte: date.setMonth(3, 1),
        $lt: date.setMonth(4, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const aprEarn = apr.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const may = await Order.find({
      createdAt: {
        $gte: date.setMonth(4, 1),
        $lt: date.setMonth(5, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const mayEarn = may.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const jun = await Order.find({
      createdAt: {
        $gte: date.setMonth(5, 1),
        $lt: date.setMonth(6, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const junEarn = jun.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const jul = await Order.find({
      createdAt: {
        $gte: date.setMonth(6, 1),
        $lt: date.setMonth(7, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const julEarn = jul.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const aug = await Order.find({
      createdAt: {
        $gte: date.setMonth(7, 1),
        $lt: date.setMonth(8, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const augEarn = aug.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const sep = await Order.find({
      createdAt: {
        $gte: date.setMonth(8, 1),
        $lt: date.setMonth(9, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const sepEarn = sep.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const oct = await Order.find({
      createdAt: {
        $gte: date.setMonth(9, 1),
        $lt: date.setMonth(10, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const octEarn = oct.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const nov = await Order.find({
      createdAt: {
        $gte: date.setMonth(10, 1),
        $lt: date.setMonth(11, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const novEarn = nov.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const dec = await Order.find({
      createdAt: {
        $gte: date.setMonth(11, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const decEarn = dec.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastYear = new Date();
    lastYear.setFullYear(2023);
    lastYear.setHours(0, 0, 0, 0);

    const lastjan = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(0, 1),
        $lt: lastYear.setMonth(1, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastjanEarn = lastjan.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastfeb = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(1, 1),
        $lt: lastYear.setMonth(2, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastfebEarn = lastfeb.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastmar = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(2, 1),
        $lt: lastYear.setMonth(3, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastmarEarn = lastmar.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastapr = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(3, 1),
        $lt: lastYear.setMonth(4, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastaprEarn = lastapr.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastmay = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(4, 1),
        $lt: lastYear.setMonth(5, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastmayEarn = lastmay.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastjun = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(5, 1),
        $lt: lastYear.setMonth(6, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastjunEarn = lastjun.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastjul = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(6, 1),
        $lt: lastYear.setMonth(7, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastjulEarn = lastjul.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastaug = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(7, 1),
        $lt: lastYear.setMonth(8, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastaugEarn = lastaug.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastsep = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(8, 1),
        $lt: lastYear.setMonth(9, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastsepEarn = lastsep.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastoct = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(9, 1),
        $lt: lastYear.setMonth(10, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastoctEarn = lastoct.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastnov = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(10, 1),
        $lt: lastYear.setMonth(11, 1),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastnovEarn = lastnov.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const lastdec = await Order.find({
      createdAt: {
        $gte: lastYear.setMonth(11, 1),
        $lt: date.setMonth(0),
      },
    }).populate([
      { path: "products", populate: [{ path: "product", select: ["price"] }] },
    ]);

    const lastdecEarn = lastdec.reduce((total, order) => {
      if (order.status === "delivered") {
        return total + order.totalCost;
      } else {
        return total + 0;
      }
    }, 0);

    const week = new Date();
    week.setDate(week.getDate() - week.getDay());

    const sun = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: week.setHours(0, 0, 0, 0),
        $lt: week.setDate(week.getDate() + 1),
      },
    });

    const mon = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: week.setHours(0, 0, 0, 0),
        $lt: week.setDate(week.getDate() + 1),
      },
    });

    const tue = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: week.setHours(0, 0, 0, 0),
        $lt: week.setDate(week.getDate() + 1),
      },
    });

    const wed = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: week.setHours(0, 0, 0, 0),
        $lt: week.setDate(week.getDate() + 1),
      },
    });

    const thu = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: week.setHours(0, 0, 0, 0),
        $lt: week.setDate(week.getDate() + 1),
      },
    });

    const fri = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: week.setHours(0, 0, 0, 0),
        $lt: week.setDate(week.getDate() + 1),
      },
    });

    const sat = await Order.find({
      status: { $ne: "canceled" },
      createdAt: {
        $gte: week.setHours(0, 0, 0, 0),
        $lt: week.setDate(week.getDate() + 1),
      },
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - (lastWeek.getDay() + 7));
    lastWeek.setHours(0, 0, 0, 0);

    const lastsun = await Order.find({
      createdAt: {
        $gte: lastWeek.setHours(0, 0, 0, 0),
        $lt: lastWeek.setDate(lastWeek.getDate() + 1),
      },
    });

    const lastmon = await Order.find({
      createdAt: {
        $gte: lastWeek.setHours(0, 0, 0, 0),
        $lt: lastWeek.setDate(lastWeek.getDate() + 1),
      },
    });

    const lasttue = await Order.find({
      createdAt: {
        $gte: lastWeek.setHours(0, 0, 0, 0),
        $lt: lastWeek.setDate(lastWeek.getDate() + 1),
      },
    });

    const lastwed = await Order.find({
      createdAt: {
        $gte: lastWeek.setHours(0, 0, 0, 0),
        $lt: lastWeek.setDate(lastWeek.getDate() + 1),
      },
    });

    const lastthu = await Order.find({
      createdAt: {
        $gte: lastWeek.setHours(0, 0, 0, 0),
        $lt: lastWeek.setDate(lastWeek.getDate() + 1),
      },
    });

    const lastfri = await Order.find({
      createdAt: {
        $gte: lastWeek.setHours(0, 0, 0, 0),
        $lt: lastWeek.setDate(lastWeek.getDate() + 1),
      },
    });

    const lastsat = await Order.find({
      createdAt: {
        $gte: lastWeek.setHours(0, 0, 0, 0),
        $lt: lastWeek.setDate(lastWeek.getDate() + 1),
      },
    });

    res.json({
      orders: [
        { name: "Sun", thisWeek: sun.length, lastWeek: lastsun.length },
        { name: "Mon", thisWeek: mon.length, lastWeek: lastmon.length },
        { name: "Tue", thisWeek: tue.length, lastWeek: lasttue.length },
        { name: "Wed", thisWeek: wed.length, lastWeek: lastwed.length },
        { name: "Thu", thisWeek: thu.length, lastWeek: lastthu.length },
        { name: "Fri", thisWeek: fri.length, lastWeek: lastfri.length },
        { name: "Sat", thisWeek: sat.length, lastWeek: lastsat.length },
      ],
      earnings: [
        { name: "Jan", thisYear: janEarn, lastYear: lastjanEarn },
        { name: "Feb", thisYear: febEarn, lastYear: lastfebEarn },
        { name: "Mar", thisYear: marEarn, lastYear: lastmarEarn },
        { name: "Apr", thisYear: aprEarn, lastYear: lastaprEarn },
        { name: "May", thisYear: mayEarn, lastYear: lastmayEarn },
        { name: "Jun", thisYear: junEarn, lastYear: lastjunEarn },
        { name: "Jul", thisYear: julEarn, lastYear: lastjulEarn },
        { name: "Aug", thisYear: augEarn, lastYear: lastaugEarn },
        { name: "Sep", thisYear: sepEarn, lastYear: lastsepEarn },
        { name: "Oct", thisYear: octEarn, lastYear: lastoctEarn },
        { name: "Nov", thisYear: novEarn, lastYear: lastnovEarn },
        { name: "Dec", thisYear: decEarn, lastYear: lastdecEarn },
      ],
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      const error = Error("order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (order.status === "confirmed" || order.status === "delivered")
      throw new Error(
        "you can't delete the order after it was " + order.status
      );

    const items = await Item.find({ order: order._id });

    for (const item of items) {
      try {
        const product = await Product.findById(item.product);
        if (!product) {
          const error = Error("product not found");
          error.statusCode = 404;
          throw new Error(error);
        }
        product.stock = product.stock + item.quantity;
        const variation = product.variations.find((v) => {
          return item.color === v.color && item.size === v.size;
        });
        variation.stock = variation.stock + item.quantity;
        await product.save();
      } catch (error) {
        return next(error);
      }
    }

    await Item.deleteMany({ order: order._id });

    res.json({
      message: "order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const setShippingDate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { shippingDate } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      const error = Error("order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (order.status === "canceled" || order.status === "delivered")
      throw new Error(
        "you can't set shiiping date after the order was " + order.status
      );

    if (
      !shippingDate ||
      (typeof shippingDate !== "string" && typeof shippingDate !== "number")
    )
      throw new Error("Invalid Date");

    if (
      new Date().setHours(0, 0, 0, 0) >
      new Date(shippingDate).setHours(0, 0, 0, 0)
    )
      throw new Error("Invalid Date");

    order.shippingDate = new Date(shippingDate);

    await order.save();

    res.json({
      message: "shipping date setted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getCartTotalPrice = async (req, res, next) => {
  try {
    const { items } = req.body;
    let totalPrice = 0;

    if (!items) throw new Error("NO items");

    if (!Array.isArray(items)) throw new Error("Wrong items structure");

    for (const item of items) {
      if (
        !item._id ||
        typeof item._id !== "string" ||
        !item.color ||
        typeof item.color !== "string" ||
        !item.size ||
        typeof item.size !== "string" ||
        !item.quantity ||
        typeof +item.quantity !== "number"
      )
        throw new Error("wrong items structure");

      const product = await Product.findById(item._id);
      if (!product) {
        const err = Error("product not found");
        err.statusCode = 404;
        next(err);
      }

      const variation = product.variations.find((v) => {
        return (
          v.color === item?.color.toLowerCase() &&
          v.size === item?.size.toLowerCase()
        );
      });
      if (!variation) throw new Error("variation not found");
      if (product.stock <= 0 && variation.stock <= 0)
        throw new Error(`${product.title} is out of stock`);

      totalPrice += product.salePrice * item.quantity;
    }

    res.json({ totalPrice });
  } catch (error) {
    next(error);
  }
};

const getOrdersToShip = async (req, res, next) => {
  try {
    const { shippingDate } = req.query;

    let where = {};

    const date = new Date(shippingDate);

    if (shippingDate) {
      where = {
        $gte: date.setHours(0, 0, 0, 0),
        $lt: date.setDate(date.getDate() + 1),
      };
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;

    const total = await Order.find({
      shippingDate: { $ne: null, $exists: true, ...where },
    }).countDocuments();

    var pages = 0;if (total) {
      pages = Math.ceil(total / pageSize);
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

    const orders = await Order.find({
      shippingDate: { $ne: null, $exists: true, ...where },
    })
      .skip(skip)
      .limit(pageSize)
      .populate([
        {
          path: "products",
          populate: [{ path: "product", select: ["price"] }],
        },
        {
          path: "shipping",
          populate: [
            {
              path: "country",
              select: ["country"],
            },
            {
              path: "state",
              select: ["state", "shippingFees"],
            },
          ],
        },
      ])
      .sort({ shippingDate: "asc" });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newOrder,
  editOrder,
  cancelOrder,
  deleteOrder,
  getOrders,
  getOrder,
  confirmOrder,
  markOrderAsDelivered,
  getSoldProductNumberAndProfits,
  getUserOrders,
  setShippingDate,
  getCartTotalPrice,
  getEarnings,
  getOrdersToShip,
};
