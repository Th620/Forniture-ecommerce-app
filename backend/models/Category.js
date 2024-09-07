const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

const Category = model("Category", CategorySchema);

module.exports = Category;
