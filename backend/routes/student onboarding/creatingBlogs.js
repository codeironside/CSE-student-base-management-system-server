const express = require("express");

const { protect } = require("../../middleware/authmiddleware");
const {
create_blog
} = require("../../controller/studentonboarding/register.student.controller");
const Router = express.Router();


Routter.route("/createBlogs").get(create_blog,protect)

module.exports = Router
