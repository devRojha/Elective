
const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    authorId : {
        type : String,
        required : true
    },
    Name : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true
    },
    AccessId : {
        type : String,
        required : true
    }
})

module.exports = AdminSchema;