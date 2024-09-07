const { Schema, model } = require("mongoose");

const StateSchema = new Schema(
  {
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    state: { type: String, required: true },
    shippingFees: { type: Number, required: true },
  },

  { timestamps: true, toJSON: { virtuals: true } }
);

StateSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "shipping.state"
});

const State = model("State", StateSchema);

module.exports = State;
