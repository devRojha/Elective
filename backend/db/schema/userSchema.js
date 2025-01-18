
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true
    },
    Password : {
        type : String,
        required : true
    },
    Admin : {
        type : Number,
        default : 0
    },
    Course : {
        type : String,
        required : true
    }
})

module.exports = userSchema;