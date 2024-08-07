const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: String },
    productInfo: { type: Object },
    onSale: { type: Boolean },
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
  }
);

const Product = model("Product", ProductSchema);

module.exports = Product;
