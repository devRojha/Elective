const mongoose = require("mongoose");
const userSchema = require("./schema/userSchema");
const resourcesSchema = require("./schema/resoursesSchema");
const adminRequest = require("./schema/RequestAdminSchema")
const admin = require("./schema/AdminSchema")
const otpSchema = require("./schema/OTPSchema")
require('dotenv').config();

const dbUrl = process.env.DBURL;

mongoose.connect(dbUrl)
.then(()=>{
    console.log('Connected to MongoDB');
}).catch(()=>{
    console.error('Connection error', err);
})

const User = mongoose.model('User', userSchema);
const Resources = mongoose.model('Resources', resourcesSchema);
const AdminRequest = mongoose.model('AdminRequest', adminRequest);
const Admin = mongoose.model('Admin', admin);
const OTPS = mongoose.model('OTP', otpSchema);

module.exports = {User, Resources, AdminRequest , Admin, OTPS};