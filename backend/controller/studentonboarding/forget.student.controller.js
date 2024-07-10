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


//route /api/vi/forgetpass
//access private 
const forgetpassword = asynchandler(async (req, res) => {
    // GET USER BASED ON POSTED EMAIL
    const user = await UserActivation.findOne({email: req.body.email});
    
    if({user}){
        const eroor = new StudentError('we could not the user with the gven email',404);
next(error);
    }
    
} )


module.exports={
    forgetpassword
}