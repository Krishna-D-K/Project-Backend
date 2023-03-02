const mongoose = require("mongoose");

const CourseContent = new mongoose.Schema({
    semester: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    publicUrl: {
        type: String,
        required: true
    },
    downloadUrl: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    anonymous: {
        type: Boolean,
        required: true
    },
    fileID: {
        type: String,
        required: true
    }
}, {timestamps : true})

module.exports = mongoose.model("CourseContent", CourseContent);