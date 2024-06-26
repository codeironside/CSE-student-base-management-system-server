const asynchandler = require("express-async-handler");
const logger = require("../../utils/logger.js");

const BLOG = require("../../model/blogs/blog.js");
const comment = require("../../model/blogs/comments.js");
const jwt = require("jsonwebtoken");
const STUDENT = require("../../model/student model/student.model");

const create_blog = asynchandler(async (req, res) => {
  try {
    const { blog_title, category, content, reading_time } = req.body;
    console.log(req);
    const { id } = req.auth;
    if (!blog_title || !content) {
      throw Object.assign(new Error("fields can not empty"), {
        statusCode: 401,
      });
    }
    var name = "gamer"
    if(!name){
      //error
    }
    const student = await STUDENT.findByID(id);
    if (!student) {
      throw Object.assign(new Error("Not a student"), { statusCode: 404 });
    }
    const blog = await BLOG.create({
      blog_title,
      owner_id: student._id,
      owner_name: student.firstName,
      category,
      content,
      reading_time,
    });

    if (blog) {
      res.status(201).json({ blog });
      logger.info(
        `User with id ${id} created a blog with id: ${blog._id} at ${blog.createdAt} - ${res.statusCode} - ${res.statusMessage} - ${req.originalUrl} - ${req.method} - from ${req.ip}`
      );
    } else {
      throw Object.assign(new Error("Error creating a blog"), {
        statusCode: 500,
      });
    }
  } catch (error) {
    console.error(error);
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
    { expiresIn: "12h" }
  );
};
module.exports = {
  create_blog,
};
