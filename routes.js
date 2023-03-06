const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {getAllCourses, getCourse, addCourse, deleteCourse, updateCourse, countCourses} = require('./controllers/CoursesController');
const { addUser, deleteUser, loginUser, getUsers, editUser } = require('./controllers/UserController');
const requireAuth = require("./middleware/requireAuth");
const { addContent, deleteContent, getContent, getCourseContent, editContent, countData, getContributors } = require('./controllers/FileController');

router.get("/courses", getAllCourses); //
router.get("/courses/count", countCourses); //
router.post("/courses", requireAuth, addCourse); //
router.get("/courses/:code", getCourse); //
router.delete("/courses/:id", requireAuth, deleteCourse); //
router.patch("/courses/:id", requireAuth, updateCourse); //
router.get("/login/users",requireAuth, getUsers) //
router.post("/login", loginUser); //
router.post("/signin", addUser); //add auth to this route before upload //
router.patch("/signin", requireAuth, editUser)
router.delete("/signin/:id", deleteUser); //
router.post("/content/upload", upload.array("file"), addContent); //
router.delete("/content/upload/:isPlaylist/:fileID", deleteContent); //add auth to this route before upload
router.patch("/content/upload", editContent); //
router.get("/content/request", requireAuth, getContent) //
router.get("/content/:code", getCourseContent) //
router.get("/content", countData) //
router.get("/contributors", getContributors)

module.exports = router;