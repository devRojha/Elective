const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index.js")
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api" , mainRouter);

app.get("/", (req, res)=>{
    res.status(200).send("hii");
})

app.listen(3000, ()=> console.log("backend is running on 3000"))