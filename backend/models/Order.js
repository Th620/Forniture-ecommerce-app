const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, default: "pending" },
    // subTotal: { type: Number, required: true },
    shippingFees: { type: Number, required: true },
    shippingDate: { type: Date },
    shipping: {
      country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
      state: { type: Schema.Types.ObjectId, ref: "State", required: true },
      city: { type: String, required: true },
      adress: { type: String, required: true },
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

OrderSchema.virtual("totalCost").get(function () {
  return this.products.reduce(
    (total, product) => total + product.product.price * product.quantity,
    0
  );
});

OrderSchema.virtual("products", {
  ref: "Item",
  localField: "_id",
  foreignField: "order",
});

const Order = model("Order", OrderSchema);

module.exports = Order;
