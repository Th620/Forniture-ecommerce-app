const { default: isEmail } = require("validator/lib/isEmail");
const User = require("../models/User");
const { sign, verify } = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: user.generateJWT(),
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

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?._id);
    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      state: user.state,
      city: user.city,
    });
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
    } = req.body;

    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found");
    }

    if (isEmail(email)) {
      user.email = email;
    } else {
      throw new Error("invalid email");
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    if (password && password.length < 8) {
      throw new Error("password must be at least 8 caracters");
    } else if (password) {
      user.password = password;
    }

    user.phone = phone;
    user.state = state;
    user.country = country;
    user.city = city;

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
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: "",
    };

    transporter.sendMail(mailOptions, function (error, seccess) {
      if (error) {
        next(error);
      } else {
        console.log(seccess);
      }
    });

    res.json({
      id: user._id,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    if (!typeof id === String) throw new Error("Wrong ID");

    let user = await User.findById(id);

    if (!user) {
      const error = Error("User not found");
      error.statusCode = 404;
      next(error);
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

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  forgotPassword,
  resetPassword,
};