const { isMobilePhone, isEmail } = require("validator");
const CustomOrder = require("../models/CustomOrder");
const User = require("../models/User");
const { verify } = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generateEmailTemplate } = require("../../frontend/utils/emailTemplate");

const addCustomOrder = async (req, res, next) => {
  try {
    const { content, name, email, phone } = req.body;

    if (!name || typeof name !== "string") throw new Error("wrong name");
    if (!isEmail(email)) throw new Error("wrong email");
    if (!isMobilePhone(phone, "ar-DZ")) throw new Error("wrong phone number");
    if (!content || typeof content !== "string" || content.length < 20)
      throw new Error("write a descriptive message");

    const { token } = req.cookies;

    if (token) {
      try {
        const { id } = verify(token, process.env.JWT_SECRET);
        if (id) {
          var user = await User.findById(id).select("-password");
        }
      } catch (error) {}
    }

    const message = await CustomOrder.create({
      content,
      name,
      email,
      phone,
      user: user && user._id,
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const getCustomOrders = async (req, res, next) => {
  try {
    const { d } = req.query;

    const date = new Date(d);

    let where = {};

    if (d) {
      where = {
        createdAt: {
          $gte: date.setHours(0, 0, 0, 0),
          $lt: date.setDate(date.getDate() + 1),
        },
      };
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = req.query.pageSize || 9;

    const total = await CustomOrder.find(where).countDocuments();

    if (total) {
      var pages = Math.ceil(total / pageSize);
    }
    const skip = (page - 1) * pageSize;

    if (pages && page > pages) {
      throw new Error("page not available");
    }

    res.header({
      "X-Totalcount": JSON.stringify(total),
      "X-CurrentPage": JSON.stringify(page),
      "X-Pagesize": JSON.stringify(pageSize),
      "X-TotalPagecount": JSON.stringify(pages),
    });

    const messages = await CustomOrder.find(where)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: "desc" });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const approveCustomOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await CustomOrder.findById(id);

    if (!message) {
      const err = Error("message not found");
      err.statusCode = 404;
      next(err);
    }

    if (message.accept) throw new Error("Order already approved");

    const { meetingDate } = req.body;
    console.log(meetingDate);

    const address = "address exemple";

    if (
      !meetingDate ||
      (typeof meetingDate !== "string" && typeof meetingDate !== "number")
    )
      throw new Error("Invalid Date");

    if (new Date() > new Date(meetingDate)) throw new Error("Invalid Date");

    const date = new Date(meetingDate);

    message.meetingDate = date;
    message.accept = true;

    await message.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: message.email,
      subject: `Meeting Confirmation for Your Custom Order - ${date.toLocaleDateString(
        "es-CL",
        {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }
      )}`,
      html: generateEmailTemplate({ name: message.name, date, address }),
    };

    transporter.sendMail(mailOptions, function (error, seccess) {
      if (error) {
        console.log(error);
      } else {
        console.log(seccess);
      }
    });

    res.json({ message: "order approved successfully" });
  } catch (error) {
    next(error);
  }
};

const rescheduleCustomOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await CustomOrder.findById(id);

    if (!message) {
      const err = Error("message not found");
      err.statusCode = 404;
      next(err);
    }

    if (!message.accept)
      throw new Error("Custom order not accepted to be edited");

    const { meetingDate } = req.body;

    const address = "address exemple";

    if (
      !meetingDate ||
      (typeof meetingDate !== "string" && typeof meetingDate !== "number")
    )
      throw new Error("Invalid Date");

    if (new Date() > new Date(meetingDate)) throw new Error("Invalid Date");

    const date = new Date(meetingDate);

    message.meetingDate = date;

    await message.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: message.email,
      subject: `Meeting Confirmation for Your Custom Order - ${date.toLocaleDateString(
        "es-CL",
        {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }
      )}`,
      html: generateEmailTemplate({ name: message.name, date, address }),
    };

    transporter.sendMail(mailOptions, function (error, seccess) {
      if (error) {
        console.log(error);
      } else {
        console.log(seccess);
      }
    });

    res.json({ message: "order approved successfully" });
  } catch (error) {
    next(error);
  }
};

const rejectCustomOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await CustomOrder.findById(id);

    if (!message) {
      const err = Error("message not found");
      err.statusCode = 404;
      next(err);
    }

    message.accept = false;

    const m = await message.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      tls: { rejectUnauthorized: false },
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: message.email,
      subject: `Custom Order Update`,
      html: `<div>
      <p>Dear ${message.name.toUpperCase()}</p>
      <p>Thank you for custom order request.</p>
      <p>Unfortunately, we are unable to fulfill it at this time.</p>
      <p>
        We apologize for any incovenience. Please let us know if we can assist you with other products or services.
      </p>
    </div>`,
    };

    transporter.sendMail(mailOptions, function (error, seccess) {
      if (error) {
        console.log(error);
      } else {
        console.log(seccess);
      }
    });

    res.json(m);
  } catch (error) {
    next(error);
  }
};

const getMeeting = async (req, res, next) => {
  try {
    const { d } = req.query;

    const date = new Date(d);

    let where = {};

    if (d) {
      where = {
        meetingDate: {
          $gte: date.setHours(0, 0, 0, 0),
          $lt: date.setDate(date.getDate() + 1),
        },
      };
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = req.query.pageSize || 9;

    const total = await CustomOrder.find({
      ...where,
      accept: true,
    }).countDocuments();

    if (total) {
      var pages = Math.ceil(total / pageSize);
    }
    const skip = (page - 1) * pageSize;

    if (pages && page > pages) {
      throw new Error("page not available");
    }

    res.header({
      "X-Totalcount": JSON.stringify(total),
      "X-CurrentPage": JSON.stringify(page),
      "X-Pagesize": JSON.stringify(pageSize),
      "X-TotalPagecount": JSON.stringify(pages),
    });

    const messages = await CustomOrder.find({ ...where, accept: true })
      .skip(skip)
      .limit(pageSize)
      .sort({ meetingDate: "asc" });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCustomOrder,
  getCustomOrders,
  approveCustomOrder,
  rejectCustomOrder,
  rescheduleCustomOrder,
  getMeeting
};
