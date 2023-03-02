const mongoose = require("mongoose")

const Courses = new mongoose.Schema({
    semester: {
        type: String,
        required : true
    },
    courseName: {
        type: String,
        required : true
    },
    courseCode: {
        type: String,
        required : true
    },
    credits: {
        type: Number,
        required : true
    },
    professor1: {
        type: String,
        required : false
    },
    professor2: {
        type: String,
        required : false
    }
})

module.exports = mongoose.model("Courses", Courses);