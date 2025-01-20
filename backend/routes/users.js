const express = require("express");
const {z} = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware");
const { User, AdminRequest, Admin } = require("../db");

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

router.get("/num", async (req , res)=>{
    try{
        const user = await User.find().select("_id");
        if(user){
            res.status(200).json({"num" : user.length});
        }
        else{
            res.status(404).json({"num" : 0})
        }
    }
    catch(e){
        console.error("Data showing failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

router.get("/info", authMiddleware,async (req , res)=>{
    const authorID = req.authorID
    try{
        const user = await User.findOne({_id : authorID}).select("-Password -AppPassword");
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

router.get("/all" , authMiddleware, async (req , res)=>{
    const authorID = req.authorID;
    try{
        const user = await User.findOne({_id : authorID});
        const users = await User.find({Course : user.Course}).select("-Password -AppPassword");
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
    const {Name, Email, Password, AppPassword, Admin, Course} = req.body;
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
                AppPassword,
                Admin : 0,
                Course
            });
            if((Admin === 1) && (AppPassword.length > 0)){
                const adminReq = await AdminRequest.create({
                    authorId : newUser._id,
                    Name,
                    Email
                })
            }
            const payload = {userId : newUser._id};
            const Token = jwt.sign(payload , secretKey);
            res.status(200).json({Token});

        }
        else{
            res.status(409).json({"msg" : "user Allready Exist"})
        }
    }
    catch (e) {
        console.error("Signup failed with error:", e);
        res.status(500).json({ "msg": "Signup failed with error" });
    }
})

router.post("/signin" , async (req , res)=>{
    const {Email, Password, AppPassword} = req.body;
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
            if(AppPassword.length > 0){
                const updateUser = await User.findOneAndUpdate({Email},{AppPassword});
                console.log(updateUser);
            }
            const payload = {userId : userFind._id};
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
    const {Name, Email, AppPassword, Course} = req.body;
    const authorID = req.authorID;
    try{
        const user = await User.findOne({_id : authorID});
        if(Name.length > 0){
            user.Name = Name;
        }
        if((Email.length > 0) && Email.includes("@nitp.ac.in")){
            user.Email = Email;
        }
        if(Course.length > 0){
            user.Course = Course;
        }
        if(AppPassword.length > 0){
            user.AppPassword = AppPassword;
        }
        console.log(user);
        const updatedUser = await User.findByIdAndUpdate({_id : authorID}, user);
        const payload = {userId : authorID};
        const Token = jwt.sign(payload , secretKey);
        res.status(200).json({Token});
    }
    catch (e) {
        console.error("update failed with error:", e);
        res.status(500).json({ "msg": "update failed with error" });
    }
})

router.put("/updatePassword" , async (req , res)=>{
    const {id, Password} = req.body;
    try{
        const hasPassword = await bcrypt.hash(Password , 10);
        const updatedUser = await User.findOneAndUpdate({_id : id},{Password : hasPassword});
        if(updatedUser){
            res.status(200).json({"msg" : "Password Updated"});
        }
        else{
            res.status(404).json({"msg" : "User not found"});
        }
    }
    catch (e) {
        console.error("update failed with error:", e);
        res.status(500).json({ "msg": "update failed with error" });
    }
})

router.delete("/delete", authMiddleware, async(req , res)=>{
    const AuthorId = req.authorID;
    try{
        const deletUser = await User.findByIdAndDelete(AuthorId);
        const deletRequest = await AdminRequest.findOneAndDelete({authorId : AuthorId});
        const deletAdmin = await Admin.findOneAndDelete({authorId : AuthorId});
        res.status(200).json({"msg": "user deleted"})
    }
    catch (e) {
        console.error("user delete failed with error:", e);
        res.status(500).json({ "msg": "user delete failed with error" });
    }
})

module.exports = router;
