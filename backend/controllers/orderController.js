const Item = require("../models/Item");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Store = require("../models/Store");
const { isObjectEmpty } = require("../utils/isObjectEmpty");

const subtotalCount = async (items, total) => {
  try {
    for (let i = 0; i < items.length; i++) {
      if (typeof items[i].product !== "string" || !items[i].product)
        throw new Error("no product ID");

      let product = await Product.findById(items[i].product);

      total = total + product.price * items[i].quantity;
    }
    return total;
  } catch (error) {
    console.log(error);
  }
};

const shippingFeesgFeesCount = async (shipping) => {
  const store = await Store.findOne();

  let countryIndex = null;
  let stateIndex = null;

  store.countriesDetails.map((item, index) => {
    if (item.country === shipping.country) {
      countryIndex = index;
    }
  });

  if (countryIndex === null)
    throw new Error("we don't provide shipping service to your adress");

  store.countriesDetails[countryIndex].states.map((item, index) => {
    if (item.state === shipping.state) {
      stateIndex = index;
    }
  });

  if (stateIndex === null)
    throw new Error("we don't provide shipping service to your adress");

  let shippingFees =
    store.countriesDetails[countryIndex].states[stateIndex].shippingFee;

  return shippingFees;
};

const newOrder = async (req, res, next) => {
  try {
    const { products, shipping } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0)
      throw new Error("can place a empty order");

    products.map(async (product) => {
      if (
        !product.product ||
        typeof product.product !== "string" ||
        !product.color ||
        !product.size ||
        !product.quantity ||
        product.quantity <= 0
      )
        throw new Error("wrong product data");
      const p = await Product.findById(product.product);
      if (!p) {
        const error = Error("Product not found");
        error.statusCode = 404;
        return next(error);
      }
      if (
        p.variations.every((variation) => {
          (variation.color !== color && variation.size !== size) ||
            variation.stock < product.quantity;
        })
      )
        throw new Error("Order Not available");
    });

    if (!shipping) throw new Error("shipping info are required");

    const store = await store.findOne({ admins: { $in: [req.user] } });

    const { countries, countriesDetails } = store;

    if (!countries.includes(shipping.country))
      throw new Error("there is no shipping service to this country");

    const states = countriesDetails.find(
      (country) => country.country === shipping.country
    );

    if (!states.includes(shipping.state))
      throw new Error("there is no shipping service to this state");

    var total = 0;

    products.map(async (product) => {
      const p = await Product.findById(product.product);
      p.stock = p.stock - product.quantity;
      p.variations = p.variations.map((variation) => {
        if (
          variation.color === product.color &&
          variation.size === product.size
        ) {
          variation.stock = variation.stock - product.quantity;
        }
      });
      await p.save();
    });

    const newOrder = await Order.create({
      client: req.user,
      products,
      shipping,
      subTotal: await subtotalCount(products, total),
      shippingFees: await shippingFeesgFeesCount(shipping),
    });
    res.status(201).json(newOrder);
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
    if (order.status === "confirmed" || order.status === "dilevred")
      throw new Error("you can't edit the order after it" + order.status);

    const { products, shipping } = req.body;

    if (products.length === 0) throw new Error("can place a empty order");
    if (isObjectEmpty(shipping))
      throw new Error("shipping info are required 1");
    if (shipping?.country == "")
      throw new Error("shipping info are required 2");
    if (shipping?.state == "") throw new Error("shipping info are required");
    if (shipping?.city == "") throw new Error("shipping info are required");
    if (shipping?.adress == "") throw new Error("shipping info are required");

    const store = await store.findOne({ admins: { $in: [req.user] } });

    const { countries, countriesDetails } = store;

    if (!countries.includes(shipping.country))
      throw new Error("there is no shipping service to this country");

    const states = countriesDetails.find(
      (country) => country.country === shipping.country
    );

    if (!states.includes(shipping.state))
      throw new Error("there is no shipping service to this state");

    let shippingFees = 10;
    let total = 0;

    order.products = products || order.products;
    order.shipping.country = shipping.country || order.shipping.country;
    order.shipping.state = shipping.state || order.shipping.state;
    order.shipping.city = shipping.city || order.shipping.city;
    order.shipping.adress = shipping.adress || order.shipping.adress;
    order.subTotal = (await subtotalCount(products, total)) || order.subTotal;
    order.shippingFees = shippingFees || order.shippingFees;

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

    if (order.status === "confirmed" || order.status === "dilevred")
      throw new Error("you can't edit the order after it" + order.status);

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
    const orders = await Order.find({ client: req.user }).populate([
      {
        path: "products",
        populate: [{ path: "product", select: ["price"] }],
      },
    ]);

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { country, status, user, period } = req.query;
    var where = {};
    if (country) {
      where = { "shipping.city": country };
    }
    if (
      status === "pending" ||
      status === "confirmed" ||
      status === "canceled" ||
      status === "dilevered"
    ) {
      where.status = status;
    }
    if (user) {
      where.client = user;
    }

    var time;

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
      .sort({ updatedAt: "desc" });

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
              select: ["price", "title", "slug", "images"],
            },
          ],
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
              select: ["price"],
            },
          ],
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

    if (order.status !== "confirmed")
      throw new Error(
        "you can't set order to be delivered before it confirmed"
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

    const profits = orders.reduce((total, order) => total + order.totalCost, 0);

    const lastMounthStart = new Date();
    lastMounthStart.setMonth(lastMounthStart.getMonth() - 1);
    lastMounthStart.setDate(1);
    lastMounthStart.setHours(0, 0, 0, 0);

    const LastMonthOrders = await Order.find({
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

    const lastMonthProfits = LastMonthOrders.reduce(
      (total, order) => total + order.totalCost,
      0
    );

    const profitsPercentage = 100 - (lastMonthProfits * 100) / profits;
    const productSlodPercentage =
      100 - (productSoldLastMonth * 100) / productSold;

    const ordersPercentage =
      100 - (LastMonthOrders.length * 100) / orders.length;

    res.json({
      profits,
      productSold,
      profitsPercentage,
      productSlodPercentage,
      orders: orders.length,
      ordersPercentage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newOrder,
  editOrder,
  cancelOrder,
  getOrders,
  getOrder,
  confirmOrder,
  markOrderAsDelivered,
  getSoldProductNumberAndProfits,
};
