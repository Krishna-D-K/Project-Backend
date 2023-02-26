const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {getAllCourses, getCourse, addCourse, deleteCourse, updateCourse} = require('./controllers/CoursesController');
const { addUser, deleteUser, loginUser, getUsers } = require('./controllers/UserController');
const requireAuth = require("./middleware/requireAuth");
const { addContent } = require('./controllers/FileController');

router.get("/courses", getAllCourses);
router.post("/courses", requireAuth, addCourse);
router.get("/courses/:code", getCourse);
router.delete("/courses/:id", requireAuth, deleteCourse);
router.patch("/courses/:id", requireAuth, updateCourse);
router.get("/login/users",requireAuth, getUsers)
router.post("/login", loginUser);
router.post("/signin", addUser);
router.delete("/signin/:id", deleteUser);
router.post("/content/upload", upload.array("file"), addContent);

module.exports = router;