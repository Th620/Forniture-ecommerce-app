const { default: isEmail } = require("validator/lib/isEmail");
const User = require("../models/User");
const { sign, verify } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Country = require("../models/Country");
const { existsArrayOfObjects } = require("../utils/exist");
const State = require("../models/State");
const { isMobilePhone } = require("validator");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!isEmail(email)) throw new Error("invalid email");

    if (!firstName) {
      throw new Error("first name is required");
    }

    if (!lastName) {
      throw new Error("last name is required");
    }

    if (!password) {
      throw new Error("password is required");
    } else if (password.length < 8) {
      throw new Error("password must be at least 8 caracters");
    }

    let user = await User.findOne({ email });

    if (user) {
      throw new Error("user already registred");
    }

    user = await User.create({ firstName, lastName, email, password });

    const token = user.generateJWT();

    res.cookie("token", token, {
      maxAge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isEmail(email)) throw new Error("invalid email");
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Wrong email and password combination");
    }

    if (!(await user.comparePassword(password))) {
      throw new Error("Wrong email and password combination");
    }

    const token = user.generateJWT();

    console.log(token);

    res.cookie("token", token, {
      maxAge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    });

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "logged out successfully" });
};

const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?._id)
      .select("-password")
      .populate([
        { path: "country", populate: [{ path: "states" }] },
        { path: "state", select: ["state", "shippingFees"] },
      ]);
    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      state,
      country,
      city,
      address,
    } = req.body;

    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found");
    }

    if (email && !isEmail(email)) throw new Error("Invalid email");

    if (firstName && typeof firstName !== "string")
      throw new Error("Enter a correct first name");

    if (lastName && typeof lastName !== "string")
      throw new Error("Enter a correct last name");

    if (password && password.length < 8)
      throw new Error("Password must be at least 8 caracters");

    if (phone && !isMobilePhone(phone, "ar-DZ"))
      throw new Error("Wrong phone number");

    if (country && typeof country !== "string")
      throw new Error("Wrong country");

    if (state && typeof state !== "string") throw new Error("Wrong country");

    if (country) {
      var countryExist = await Country.findById(country).populate([
        {
          path: "states",
          select: ["state"],
          populate: { path: "orders" },
        },
      ]);

      if (!countryExist) {
        const error = Error("country not found");
        error.statusCode = 404;
        return next(error);
      }
    }

    if (state) {
      const stateExist = await State.findOne({
        _id: state,
        country: countryExist._id,
      });

      if (!stateExist) {
        const error = Error("State not found");
        error.statusCode = 404;
        return next(error);
      }
    }

    if (city && typeof city !== "string") throw new Error("wrong city");
    if (address && typeof address !== "string") throw new Error("wrong adress");

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.password = password || user.password;
    user.phone = phone || user.phone;
    user.country = country || user.country;
    user.state = state || user.state;
    user.city = city || user.city;
    user.address = address || user.address;

    const updatedUser = await user.save({ isNew: false });

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      country: updatedUser.country,
      state: updatedUser.state,
      city: updatedUser.city,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!isEmail(email)) throw new Error("invalid email");

    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found");

    const secret = process.env.JWT_SECRET2 + user.password;
    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = sign(payload, secret, { expiresIn: "10m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const link = `http://localhost:3000/account/reset-password/${user._id}/${token}`;

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: `<div>
      <h4>Click on the button below to reset your password</h4>
      <p>${link}</p>
      <br />
      <p>if you didn't request to reset your password just ignore this email</p>
    </div>`,
    };

    transporter.sendMail(mailOptions, function (error, seccess) {
      if (error) {
        console.log(error);
      } else {
        console.log(seccess);
      }
    });
    res.json({ message: "email sent" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    let user = await User.findById(id);

    if (!user) {
      const error = Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const secret = process.env.JWT_SECRET2 + user.password;

    verify(token, secret);
    const { password } = req.body;

    if (password && password.length < 8)
      throw new Error("password must be at least 8 caracters");
    if (!password) throw new Error("Password is required");

    user.password = password;
    await user.save({ isNew: false });

    res.json({
      message: "password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.admin = !user.admin;

    await user.save({ isNew: false });

    res.json({ message: "user updated successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    var filter = {};
    if (role?.toLowerCase() === "admin") {
      filter.admin = true;
    }
    if (role?.toLowerCase() === "client") {
      filter.admin = false;
    }
    const users = await User.find(filter).populate([{ path: "orders" }]);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      const error = Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete({ _id: id });

    if (!user) {
      const error = Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json({ message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
  logout,
  updateUserRole,
  getAllUsers,
  getUser,
  deleteUser,
};
