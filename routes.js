const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {getAllCourses, getCourse, addCourse, deleteCourse, updateCourse} = require('./controllers/CoursesController');
const { addUser, deleteUser, loginUser, getUsers } = require('./controllers/UserController');
const requireAuth = require("./middleware/requireAuth");
const { addContent, deleteContent, getContent, getCourseContent, editContent } = require('./controllers/FileController');

router.get("/courses", getAllCourses); //
router.post("/courses", requireAuth, addCourse); //
router.get("/courses/:code", getCourse); //
router.delete("/courses/:id", requireAuth, deleteCourse); //
router.patch("/courses/:id", requireAuth, updateCourse); //
router.get("/login/users",requireAuth, getUsers) //
router.post("/login", loginUser); //
router.post("/signin", addUser); //add auth to this route before upload //
router.delete("/signin/:id", deleteUser); //
router.post("/content/upload", upload.array("file"), addContent); //
router.delete("/content/upload/:isFile/:fileID", deleteContent); //add auth to this route before upload
router.patch("/content/upload", editContent); //
router.get("/content/request", requireAuth, getContent) //
router.get("/content/:code", getCourseContent) //

module.exports = router;