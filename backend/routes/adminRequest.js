const express = require("express");
const {z} = require("zod");
const authMiddleware = require("../middleware/authMiddleware");
const { User, Admin, AdminRequest } = require("../db");

const router = express();

router.get("/all" , authMiddleware , async (req,res)=>{
    try{
        const users = await AdminRequest.find().select("Name Email authorId");
        res.status(200).json(users);
    }
    catch(e){
        console.error("Getting All user failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

router.get("/admin/all" , authMiddleware , async (req,res)=>{
    try{
        const users = await Admin.find();
        res.status(200).json(users);
    }
    catch(e){
        console.error("Getting All user failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

router.put("/access", authMiddleware, async (req , res)=>{
    const { id }  = req.body;
    const authorId = req.authorID;
    try{
        const author = await User.findById(authorId).select("Admin");
        if(author.Admin === 1){
            const user = await User.findOneAndUpdate(
                {_id : id},
                {
                    Admin : 1
                }
            );
            const Makeadmin = await Admin.create({
                authorId : id,
                Name : user.Name,
                Email : user.Email,
                AccessId : authorId
            })
            const removedRequest = await AdminRequest.findOneAndDelete({authorId :id});
            res.status(200).json({"msg" : "Access made"})
        }
        else{
            res.status(409).json({"msg" : "Author is not an Admin"})
        }
    }
    catch(e){
        console.error("Access made failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

router.put("/remove", authMiddleware, async (req , res)=>{
    const { id }  = req.body;
    try{
        const removedRequest = await AdminRequest.findOneAndDelete({authorId :id});
        res.status(200).json({"msg" : "Access removed"})
    }
    catch(e){
        console.error("Access removing failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

module.exports = router;