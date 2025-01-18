const mongoose = require("mongoose");
const userSchema = require("./schema/userSchema");
const resourcesSchema = require("./schema/resoursesSchema");
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

module.exports = {User, Resources};