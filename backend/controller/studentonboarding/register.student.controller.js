const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const STUDENT = require("../../model/student model/student.model");
const SHOPS = require("../../model/shops/shop");
const COMMENT = require("../../model/blogs/comments");
const BLOGS = require("../../model/blogs/blog");
const logger = require("../../utils/logger");
const { DateTime } = require("luxon");
const { convertToWAT } = require("../../utils/datetime");
const BOOKING = require("../../model/payment/booking");
const nodemailer = require("nodemailer");

const currentDateTimeWAT = DateTime.now().setZone("Africa/Lagos");

const register_student = asynchandler(async (req, res) => {
  try {
    const ip = req.ip;
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      userName,
      phoneNumber,
      pictureUrl,
      matricNumber,
      bio,
      department,
      level,
      faculty,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !userName ||
      !phoneNumber
    ) {
      throw Object.assign(new Error("Fields cannot be empty"), {
        statusCode: 400,
      });
    }

    const findEmail = await STUDENT.findOne({ email: email });
    if (findEmail) {
      throw Object.assign(new Error("User already exists"), {
        statusCode: 409,
      });
    }

    const exist = await STUDENT.findOne({ userName: userName });
    if (exist)
      throw Object.assign(new Error("User Name already exists"), {
        statusCode: 409,
      });

    if (!exist) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const createStudent = await STUDENT.create({
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword,
        userName,
        phoneNumber,
        pictureUrl,
        bio,
        level,
        department,
        faculty,
        matricNumber
      });
      const token = generateToken(createUsers._id);
      if (createStudent) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.gmail,
            pass: process.env.password,
          },
        });
        // console.log(transporter);
        const html = `
                  `;

        const mailOptions = {
          from: process.env.gmail,
          to: email,
          subject: `confirm yout mail, ${lastName} `,
          html: html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            throw new Error("email not sent");
          } else {
            console.log("Email sent: " + info.response);

            res
              .status(202)
              .header("Authorization", `Bearer ${token}`)
              .json({
                ...userWithoutPassword._doc,
                referredUsers,
              });

            logger.info(
              `User with ID ${createUsers._id} was created at ${createUsers.createdAt} - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
            );
          }
        });
      }
    } else {
      throw Object.assign(new Error(`registration unsucessful`), {
        statusCode: 401,
      });
    }
  } catch (error) {
    throw Object.assign(new Error(`${error}`), {
      statusCode: error.statusCode,
    });
  }
});

const generateToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "48h" }
  );
};

module.exports = {
  register_student,
};
