const { Schema, models } = require("mongoose");

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    category: { type: String },
    productInfo: { type: Object },
    onSale: { type: Boolean },
    stock: { type: Number },
    stockInfo: { type: Object },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Product = models("Product", ProductSchema);

module.exports = Product;
