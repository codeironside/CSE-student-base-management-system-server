const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const STUDENT = require("../../model/student model/student.model");
const logger = require("../../utils/logger");
const nodemailer = require("nodemailer");

// Function to send email 
const sendEmail = async (to, subject, text) => {
    // Email sending logic
};

// Generate and send verification code to user's email
const sendVerificationCode = asynchandler(async (req, res) => {
    try {
        const user = await STUDENT.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).send('User with this email is not found.');
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
        const token = jwt.sign({ id: user._id, code: verificationCode }, process.env.JWT_SECRET, { expiresIn: '15m' });

        await sendEmail(user.email, 'Verification Code', `Your verification code is: ${verificationCode}`);
        res.send({ message: 'Verification code sent to your email.', token });
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error.');
    }
});

// Verify the code and update password
const verifyCodeAndUpdatePassword = asynchandler(async (req, res) => {
    const { token, verificationCode, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.code !== verificationCode) {
            return res.status(400).send('Invalid verification code.');
        }

        const user = await STUDENT.findById(decoded.id);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.send('Password has been updated successfully.');
    } catch (error) {
        logger.error(error);
        res.status(500).send('Internal server error.');
    }
});

module.exports = {
    sendVerificationCode,
    verifyCodeAndUpdatePassword
};
