const mongoose = require("mongoose")

const Users = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    role: {
        type: String,
        required : true
    },
    rollNo: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    }
})

module.exports = mongoose.model("Users", Users);