const mongoose = require("mongoose");

const resourcesSchema = new mongoose.Schema({
    Title : {
        type : String,
        required : true
    },
    AuthorId : {
        type : String,
        required : true
    },
    PDF : {
        type : String,
    },
    Text : {
        type : String,
    },
    Courses : {
        type : String,
        required : true
    }
})

module.exports = resourcesSchema