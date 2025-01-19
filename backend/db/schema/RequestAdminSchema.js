
const mongoose = require('mongoose');

const RequestAdminSchema = new mongoose.Schema({
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
    }
})

module.exports = RequestAdminSchema;