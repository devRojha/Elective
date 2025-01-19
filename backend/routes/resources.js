const express = require("express");
// const multer = require("multer");
// const { v4: uuid } = require("uuid");
const fs = require("fs");
// const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const { Resources } = require("../db");

const router = express();

require('dotenv').config();


// const dirFile = path.join(__dirname, "uploads"); // Path to the uploads directory
// if (!fs.existsSync(dirFile)) {
//   fs.mkdirSync(dirFile, { recursive: true }); // Create the directory recursively
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, dirFile); // Save files to the dynamically created "uploads" directory
//     },
//     filename: (req, file, cb) => {
//       const uniqueFilename = `${uuid()}-${file.originalname}`;
//       cb(null, uniqueFilename); // Unique filename to avoid collisions
//     },
// });

// const fileFilter = (req, file, cb) => {
//     const allowedFileTypes = /jpeg|jpg|png|pdf|docx/;
//     const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedFileTypes.test(file.mimetype);
  
//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only images and document files are allowed"));
//     }
// };
  
// // Create the upload middleware
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//     fileFilter: fileFilter,
// });

// const DeleteFile = async (filename) => {
//     try {
//         const file = path.join(dirFile, filename);
//         if (fs.existsSync(file)) {
//             await fs.promises.unlink(file); // Use the async version for non-blocking IO
//             console.log(`File ${filename} deleted successfully.`);
//         } else {
//             console.warn(`File ${filename} does not exist.`);
//         }
//     } catch (error) {
//         console.error(`Failed to delete file ${filename}:`, error.message);
//     }
// };

// individual info
router.get("/info" , async (req , res)=>{
    const id = req.headers.id;
    console.log(id)
    try{
        if(id){
            const data = await Resources.findById(id);
            if(data){
                res.status(200).json({data});
            }
            else{
                res.status(404).json({"msg" : "Empty Folder"})
            }
        }
        else{
            res.status(409).json({"msg" : "id is empty"})
        }
    }
    catch(e){
        console.error("Data showing failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

// All info courses wise
router.post("/all" , async (req , res)=>{
    const {Courses} = req.body
    try{
        const AllData = await Resources.find({Courses});
        const list = [];
        if(AllData){
            for(var i = 0 ; i < AllData.length ; i++){
                list.push({Title : AllData[i].Title , id : AllData[i]._id});
            }
            res.status(200).json({list});
        }
        else{
            res.status(404).json({"msg" : "list not found"});
        }
    }
    catch(e){
        console.error("List showing failed with error: ", e);
        res.status(500).json({ "msg": "Internal Server down" });
    }
})

// router.post("/upload" ,authMiddleware, upload.single("file"), async (req , res)=>{
router.post("/upload" ,authMiddleware , async (req , res)=>{
    // use Multer
    const {Title, Text, Courses, file} = req.body;
    const AuthorId = req.authorID;
    // const file = req.file;
    try{
        if(file.length > 0 && Text.length > 0){
            const newData = await Resources.create({
                Title,
                AuthorId,
                Text,
                Courses ,
                PDF : file
                // PDF : file.path,
            });
            res.status(200).json({"msg" : "Data uploaded"});
        }
        else if(file.length == 0 && (Text.length > 0)){
            const newData = await Resources.create({
                Title,
                AuthorId,
                Text,
                Courses 
            });
            res.status(200).json({"msg" : "Data uploaded"});
        }
        else if(file && Text.length == 0){
            const newData = await Resources.create({
                Title,
                AuthorId,
                Courses,
                PDF : file
                // PDF : file.path,
            });
            res.status(200).json({"msg" : "Data uploaded"});
        }
        else{
            return res.status(400).json({ message: "No Data uploaded" });
        }
    }
    catch (e) {
        console.error("upload failed with error:", e);
        res.status(500).json({ "msg": "upload failed with error" });
    }
})

// router.put("/updatePDF" ,authMiddleware, upload.single("file"), async (req , res)=>{
router.put("/updatePDF" ,authMiddleware, async (req , res)=>{
    // use Multer
    const {id, file} = req.body;
    const AuthorId = req.authorID ;
    try{
        // const deletefile = await DeleteFile(filename);
        const newData = await Resources.updateOne({
            _id : id
        },{
            PDF : file,
            AuthorId
        });
        res.status(200).json({"msg" : "PDF updated"});
    }
    catch (e) {
        console.error("PDF updated failed with error:", e);
        res.status(500).json({ "msg": "PDF updated failed with error" });
    }
})

router.put("/updateText" ,authMiddleware, async (req , res)=>{
    // use Multer
    const {id, Text} = req.body;
    const AuthorId = req.authorID ;
    try{
        const newData = await Resources.updateOne({
            _id : id
        },{
            Text,
            AuthorId
        });
        res.status(200).json({"msg" : "Text updated"});
    }
    catch (e) {
        console.error("Text updated failed with error:", e);
        res.status(500).json({ "msg": "Text updated failed with error" });
    }
})

router.put("/updateTitle" ,authMiddleware, async (req , res)=>{
    // use Multer
    const {Title, id} = req.body;
    const AuthorId = req.authorID ;
    try{
        if(Title){
            const newData = await Resources.updateOne(
            {
                _id : id
            },{
                Title : Title,
                AuthorId
            });
            res.status(200).json({"msg" : "Title updated"});
        }
    }
    catch (e) {
        console.error("Title updated failed with error:", e);
        res.status(500).json({ "msg": "Title updated failed with error" });
    }
})

router.delete("/delete" ,authMiddleware, async (req , res)=>{
    // use Multer
    const {id } = req.body;
    try{
        // const deletefile = await DeleteFile(filename);
        const resFound = await Resources.findOneAndDelete({_id : id});
        res.status(200).json({"msg" : "Deleted"});
    }
    catch (e) {
        console.error("Signup failed with error:", e);
        res.status(500).json({ "msg": "Signup failed with error" });
    }
})

module.exports = router;