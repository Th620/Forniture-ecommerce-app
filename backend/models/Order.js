const { Schema, models } = require("mongoose");

const OrderSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: "user", required: true },
    products: { type: [Object], required: true },
    status: { type: String, default: "open" },
    subTotal: { type: Number, required: true },
    shippingFees: { type: Number, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    adress: { type: String, required: true },
    phone: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = models("Order", OrderSchema);
