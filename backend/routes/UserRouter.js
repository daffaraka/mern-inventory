const express = require("express");
const router = express.Router();
const { register, login, getMe, getAlluser } = require("../controllers/UserController");

const { protect } = require("../middlewares/ProtectRouters");

// User Routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/users", protect, getAlluser)
module.exports = router;
