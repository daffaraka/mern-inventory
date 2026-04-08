const express = require("express");
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/CategoryController");

const { protect } = require("../middlewares/ProtectRouters");
const { adminOnly } = require("../middlewares/AdminMiddleware");



router.route("/")
    .get(protect, getCategories)
    .post(protect, adminOnly, createCategory);

router.route("/:id")
    .get(protect, getCategoryById)
    .put(protect, adminOnly, updateCategory)
    .delete(protect, adminOnly, deleteCategory);
