const { Schema, model } = require("mongoose");

const CustomOrderSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    accept: { type: Boolean, default: null },
    meetingDate: {type: Date}
  },
  { timestamps: true }
);

const CustomOrder = model("CustomOrder", CustomOrderSchema);

module.exports = CustomOrder;
