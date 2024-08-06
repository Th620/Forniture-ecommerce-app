const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    product: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    check: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = model("Review", ReviewSchema);
