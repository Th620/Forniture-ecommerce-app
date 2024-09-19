const { hash, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    country: { type: Schema.Types.ObjectId, ref: "Country" },
    state: { type: Schema.Types.ObjectId, ref: "State" },
    city: { type: String },
    address: { type: String },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

UserSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "client",
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
});

UserSchema.methods.generateJWT = function () {
  return sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

UserSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
