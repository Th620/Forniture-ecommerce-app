const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: String, required: true },
    productInfo: { desc: { type: String }, features: { type: Array } },
    onSale: { type: Boolean, default: false },
    stock: { type: Number, required: true },
    sizes: { type: [String] },
    colors: { type: [String] },
    variations: [
      {
        size: { type: String },
        color: { type: String },
        stock: { type: Number },
      },
    ],
    sizes: { type: [String] },
    images: { type: [String] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

const Product = model("Product", ProductSchema);

module.exports = Product;
