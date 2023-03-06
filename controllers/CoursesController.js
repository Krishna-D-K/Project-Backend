const Courses = require("../models/courses");

const getAllCourses = async (req, res) => {
    const data = await Courses.find({});
    res.status(200).json(data);
}

const getCourse = async (req, res) => {
    const { code } = req.params;
    const data = await Courses.find(
        {
            courseCode: code
        }
    )
    if (!data) {
        res.status(404).json("No such data found");
    }

    res.status(200).json(data);
}

const addCourse = async (req, res) => {
    console.log(req.body);
    try {
        const course = await Courses.create({ ...req.body });
        res.status(200).json(course);
    } catch (err) {
        console.log(err);
    }
}

const deleteCourse = async (req, res) => {
    const { id } = req.params;
    const data = await Courses.findOneAndDelete({
        _id: id
    })
    res.status(200).json(data);
}

const updateCourse = async (req, res) => {
    const { id } = req.params;
    const data = await Courses.findOneAndUpdate({ _id: id }, { ...req.body })
    console.log(data);
    res.status(200).json(data);
}

const countCourses = async (req, res) =>{
    const data = await Courses.count({})
    res.status(200).json(data);
}

module.exports = { getAllCourses, getCourse, addCourse, deleteCourse, updateCourse, countCourses }