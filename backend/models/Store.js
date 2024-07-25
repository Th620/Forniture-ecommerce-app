const { Schema, models } = require("mongoose");

const StoreSchema = new Schema(
  {
    categories: { type: [String], required: true },
    countries: { type: [Object], required: true },
  },
  { timestamps: true }
);

const Store = models("Store", StoreSchema);
