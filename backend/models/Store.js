const { Schema, model } = require("mongoose");

const StoreSchema = new Schema(
  {
    categories: { type: [String], required: true },
    countries: [
      {
        country: { type: String, required: true },
        states: { type: [String], required: true },
      },
    ],
  },
  { timestamps: true }
);

const Store = model("Store", StoreSchema);

module.exports = Store;
