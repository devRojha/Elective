
const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    Email : {
        type : String,
        required : true
    },
    OTP : {
        type : String,
        required : true
    }
})

module.exports = OTPSchema;