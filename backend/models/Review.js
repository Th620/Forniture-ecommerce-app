const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    product: { type: Schema.Types.ObjectId, ref: "product", required: true },
    content: { type: String, required: true },
    check: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = model("Review", ReviewSchema);

module.exports = Review;
