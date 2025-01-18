const express = require("express");
const {z} = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const { User } = require("../db");

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const signupType = z.object({
    Name : z.string().min(3),
    Email : z.string().email(),
    Password : z.string().min(3),
    Course : z.string().min(2),
});

const signinType = z.object({
    Email : z.string().email(),
    Password : z.string().min(3),
})
const router = express();

router.get("/info", authMiddleware,async (req , res)=>{
    const authorID = req.authorID
    try{
        const user = await User.findOne({_id : authorID}).select("-Password");
        if(user){
            res.status(200).json({user});
        }
        else{
            res.status(404).json({"msg" : "user not found"})
        }
    }
    catch(e){
        console.error("Data showing failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

router.get("/all" , async (req , res)=>{
    try{
        const users = await User.find().select("-Password");
        if(users){
            res.status(200).json({users});
        }
        else{
            res.status(409).json({"msg" : "no any users are here"});
        }
    }
    catch(e){
        console.error("Users showing failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

router.post("/signup" , async (req , res)=>{
    const {Name, Email, Password, Admin, Course} = req.body;
    const zodPass = signupType.safeParse({Name, Email,Password, Course});
    if(!zodPass.success || !(Email.includes("@nitp.ac.in"))){
        res.status(409).json({"msg" : "Wrong Credential"})
        return;
    }
    try{
        const userFind = await User.findOne({Email});
        if(!userFind){
            const hasPassword = await bcrypt.hash(Password , 10);
            const newUser = await User.create({
                Name,
                Email,
                Password : hasPassword,
                Admin,
                Course
            });
            const payload = {userId : newUser._id , txt : Password};
            const Token = jwt.sign(payload , secretKey);
            res.status(200).json({Token});
        }
    }
    catch (e) {
        console.error("Signup failed with error:", e);
        res.status(500).json({ "msg": "Signup failed with error" });
    }
})

router.post("/signin" , async (req , res)=>{
    const {Email, Password} = req.body;
    const zodPass = signinType.safeParse({Email, Password});
    if(!zodPass.success || !(Email.includes("@nitp.ac.in"))){
        res.status(409).json({"msg" : "Wrong Credential"})
        return;
    }
    try{
        const userFind = await User.findOne({Email});
        if(!userFind){
            res.status(404).json({"msg" : "User not found"});
            return ;
        }
        const passwordMatch = await bcrypt.compare(Password, userFind.Password);
        if(passwordMatch){
            const payload = {userId : userFind._id , txt : Password};
            const Token = jwt.sign(payload , secretKey);
            res.status(200).json({Token});
        }
        else{
            res.status(409).json({"msg" : "Wrong Credential"});
        }
    }
    catch (e) {
        console.error("Signup failed with error:", e);
        res.status(500).json({ "msg": "Signup failed with error" });
    }
})

router.put("/update" , authMiddleware , async (req , res)=>{
    const {Name, Email, Password, Course} = req.body;
    const authorID = req.authorID;
    try{
        const user = await User.findOne({_id : authorID});
        if(Name != null){
            user.Name = Name;
        }
        if(Email != null ){
            user.Email = Email;
        }
        if(Password != null){
            const hasPassword = await bcrypt.hash(Password , 10);
            user.Password = hasPassword;
        }
        if(Course != null){
            user.Course = Course;
        }
        console.log(user);
        const updatedUser = await User.findByIdAndUpdate({_id : authorID}, user);
        const payload = {userId : authorID , txt : Password};
        const Token = jwt.sign(payload , secretKey);
        res.status(200).json({Token});
    }
    catch (e) {
        console.error("update failed with error:", e);
        res.status(500).json({ "msg": "update failed with error" });
    }
})

module.exports = router;