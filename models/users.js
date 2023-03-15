const mongoose = require("mongoose")

const Users = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    instiMail: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    fbLink: {
        type: String,
        required: false
    },
    linkedinLink: {
        type: String,
        required: false
    },
    createdBy: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Users", Users);