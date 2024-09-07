const { Schema, model } = require("mongoose");

const ItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

ItemSchema.virtual("subtotal").get(function () {
  return this.product?.price * this.quantity;
});

const Item = model("Item", ItemSchema);

module.exports = Item;
