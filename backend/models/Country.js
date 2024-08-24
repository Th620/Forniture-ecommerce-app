const { Schema, model } = require("mongoose");

const CountrySchema = new Schema(
  {
    country: { type: String, required: true },
    states: [
      {
        state: { type: String, required: true },
        shippingFee: { type: String, required: true },
      },
    ],
  },

  { timestamps: true }
);

const Country = model("Country", CountrySchema);

module.exports = Country;
