const { Schema, model } = require("mongoose");

const CountrySchema = new Schema(
  {
    country: { type: String, required: true },
  },

  { timestamps: true, toJSON: { virtuals: true } }
);

CountrySchema.virtual("states", {
  ref: "State",
  localField: "_id",
  foreignField: "country",
});

CountrySchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "shipping.country",
});

const Country = model("Country", CountrySchema);

module.exports = Country;
