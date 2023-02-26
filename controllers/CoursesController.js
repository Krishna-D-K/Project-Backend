const {Courses} = require("../models");

const getAllCourses = async (req, res) =>{
    const data = await Courses.findAll();
    res.status(200).json(data);
}

const getCourse = async (req, res)=>{
    const {code} = req.params;
    const data = await Courses.findAll({
        where: {
            courseCode : code
        }
    })
    if(!data){
        res.status(404).json("No such data found");
    }

    res.status(200).json(data);
}

const addCourse = async (req, res) =>{
    console.log(req.body);
    try{
        const course = await Courses.create(req.body);
        res.status(200).json(course);
    }catch(err){
        console.log(err);
    }
}

const deleteCourse = async (req, res)=>{
    const {id} = req.params;
    const data = await Courses.destroy({
        where: {
            id: id
        }
    })
    res.status(200).json(data);
}

const updateCourse = async (req, res) =>{
    const {id} = req.params;
    const data = Courses.update({...req.body}, {
        where: {
            id: id
        }
    })
    res.status(200).json(data);
}

module.exports = {getAllCourses, getCourse, addCourse, deleteCourse, updateCourse}