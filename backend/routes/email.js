const express = require("express");
const EmailAuthMiddleware = require("../middleware/EmailAuthMiddleware");
// require('dotenv').config();

const router = express();


const nodemailer = require('nodemailer');

const sendEmail = async (sE, sP, recivers, message)=>{
    const senderEmail = sE;
    const senderPassword = sP;
    console.log(senderEmail);
    console.log(senderPassword);

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Using Gmail as the email service
        auth: {
            user: senderEmail,  // Your Gmail
            pass: senderPassword   // Your Gmail password
        }
    });
    
    const mailOptions = {
        from: senderEmail,  // Sender address
        to: recivers.join(','),   // List of recipients (join all emails from the `nitpmail` array)
        subject: 'New Notification',
        text: message,
    };

    try {
        // Send the email
        const emailResponse = await transporter.sendMail(mailOptions);
        console.log('Email sent:', emailResponse);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

router.post("/" , EmailAuthMiddleware, async (req , res)=>{
    authorEmail = req.authorEmail;
    authorTxt = req.txt;
    const message = req.body.message;
    const recivers= req.body.recivers;
    try{
        await sendEmail(authorEmail, authorTxt, recivers, message);
        res.status(200).json({"msg" : "Mail Sent"});
    }
    catch (e) {
        console.error("email sent failed with error:", e);
        res.status(500).json({ "msg": "email sent failed with error" });
    }
})

module.exports = router;
