const Order = require("../models/Order");
const Product = require("../models/Product");
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

const newOrder = async (req, res, next) => {
  try {
    const { products, shipping } = req.body;

    if (!products || products == []) throw new Error("can place a empty order");
    if (!shipping) throw new Error("shipping info are required");

    let shippingFees = 10;
    var total = 0;

    const newOrder = await Order.create({
      client: req.user,
      products,
      shipping,
      subTotal: await subtotalCount(products, total),
      shippingFees,
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

const getOrders = async (req, res, next) => {
  try {
    if (req.user.admin) {
      var orders = await Order.find();
    } else {
      var orders = await Order.find({ client: req.user });
    }

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.admin) {
      var order = await Order.findById(id);
    } else {
      var order = await Order.findOne({ _id: id, client: req.user });
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

module.exports = {
  newOrder,
  editOrder,
  cancelOrder,
  getOrders,
  getOrder,
  confirmOrder,
};
