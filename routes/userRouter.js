const express = require("express");
const { register,login, profilePic, logout, me} = require("../controller/user.controller");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {upload} =require("../utils/cloudinaryConfig");


const router = express.Router();

// Route to handle user submissions
router.post("/api/v1/register", register);

// Route to fetch all users
router.post("/api/v1/login", login);

router.get("/api/v1/logout",logout);
router.get("/api/v1/me",isAuthenticated,me);
router.put("/api/v1/updatePic",upload.single('profilePhoto'),isAuthenticated,profilePic);

module.exports = router;
