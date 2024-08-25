const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    content: { type: String, required: true },
    check: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Review = model("Review", ReviewSchema);

module.exports = Review;
