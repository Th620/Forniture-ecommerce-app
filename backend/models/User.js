const { hash, compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
});

UserSchema.methods.generateJWT = () => {
  return sign({ id: this.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

UserSchema.methods.comprePassword = async (password) => {
  return await compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
