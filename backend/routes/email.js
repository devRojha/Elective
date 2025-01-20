const express = require("express");
const EmailAuthMiddleware = require("../middleware/EmailAuthMiddleware");
const { User } = require("../db");
// require('dotenv').config();

const router = express();

require('dotenv').config();

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

router.post("/link" ,  async (req , res)=>{
    const {Email} = req.body;
    let recivers = [];
    recivers.push(Email);
    try{
        const authorEmail = process.env.EMAIL;
        const authorTxt = process.env.APPPASS;
        const user = await User.findOne({Email : Email}).select("_id Name");
        if(!user){
            res.status(404).json({"msg" : "user not found"});
            return;
        }
        console.log(user);
        const Api = process.env.REQUESTAPI
        const message= 
        `
        Hii ${user.Name}

        You have requested for Password change.
        Please follow to below Link to update your Password
          
        Link : ${Api}/${user._id}

        Note : Please do not share this Link to anyone and this is an auto generated Mail so please do not reply to this mail.

        Regards
        Devraj 
        ` ;
        await sendEmail(authorEmail, authorTxt, recivers, message);
        res.status(200).json({"msg" : "Link Sent"});
    }
    catch (e) {
        console.error("Link sent failed with error:", e);
        res.status(500).json({ "msg": "Link sent failed with error" });
    }
})

router.post("/" ,EmailAuthMiddleware, async (req , res)=>{
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
