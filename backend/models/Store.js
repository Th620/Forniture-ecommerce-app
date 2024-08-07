const { Schema, model } = require("mongoose");

const StoreSchema = new Schema(
  {
    admins: [Schema.Types.ObjectId],
    categories: { type: [String], required: true },
    countriesDetails: [
      {
        country: { type: String, required: true },
        states: [
          {
            state: { type: String, required: true },
            shippingFee: { type: String, required: true },
          },
        ],
      },
    ],
    countries: { type: [String], required: true },
  },
  { timestamps: true }
);

const Store = model("Store", StoreSchema);

module.exports = Store;
