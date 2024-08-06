const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "user", required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: { type: String, default: "pending" },
    subTotal: { type: Number, required: true },
    shippingFees: { type: Number, required: true },
    shipping: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      adress: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);

module.exports = Order;
