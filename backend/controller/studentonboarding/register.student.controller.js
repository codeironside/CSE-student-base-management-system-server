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
        matricNumber,
      });
      const token = generateToken(createStudent._id);
      if (createStudent) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.gmail,
            pass: process.env.password,
          },
        });
        // console.log(transporter);
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
        }
        .header {
            background-color: #795548;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            color: #795548;
        }
        .content p {
            color: #333333;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            background-color: #795548;
            color: #ffffff;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            background-color: #f5f5f5;
            color: #777777;
            text-align: center;
            padding: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to Our Community!</h1>
        </div>
        <div class="content">
            <h2>Hello ${firstName},</h2>
            <p>We are thrilled to have you here! Thank you for signing up. We are committed to providing you with the best experience possible.</p>
            <p>If you have any questions or need assistance, feel free to reach out to our support team. We're always here to help.</p>
            <a href="#" class="button">Join the Journey</a>
            <p>Best regards,<br>The Group one Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Group One. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

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
                ...createStudent._doc,
              });

            logger.info(
              `User with ID ${createStudent._id} was created at ${createStudent.createdAt} - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`
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
    console.log(error);
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
