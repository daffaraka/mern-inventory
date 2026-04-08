const asyncHandler = require("../utils/AsyncHandler");
const Category = require("../models/CategoryModel");
const StockHistory = require("../models/StockHistoryModel");

// @desc    Create a Category
// @route   POST /api/Categorys
// @access  Private (Admin)
const createCategory = asyncHandler(async (req, res) => {
    const { name, sku } = req.body;

    const CategoryExists = await Category.findOne({ name, user: req.user.id });
    if (CategoryExists) {
        res.status(400);
        throw new Error("Category with this name already exists in your inventory");
    }

    const Category = await Category.create({
        user: req.user.id,
        name,
        sku,
    });

    // Log initial stock as IN if quantity > 0
    if (quantity > 0) {
        await StockHistory.create({
            user: req.user.id,
            CategoryId: Category._id,
            type: "IN",
            quantity: quantity,
            reason: "Initial Stock",
        });
    }

    res.status(201).json(Category);
});

// @desc    Get all Categorys
// @route   GET /api/Categorys
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
    const Categorys = await Category.find().sort("-createdAt");
    res.status(200).json({ Categorys, user: req.user });
});

// @desc    Get single Category
// @route   GET /api/Categorys/:id
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
    const Category = await Category.findOne({ _id: req.params.id });
    if (!Category) {
        res.status(404);
        throw new Error("Category not found in your inventory");
    }
    res.status(200).json(Category);
});

// @desc    Update Category
// @route   PUT /api/Categorys/:id
// @access  Private (Admin)
const updateCategory = asyncHandler(async (req, res) => {
    const { name, sku, category, price, quantity, minStock, description, supplier } = req.body;
    const Category = await Category.findOne({ _id: req.params.id, user: req.user.id });

    if (!Category) {
        res.status(404);
        throw new Error("Category not found in your inventory");
    }

    // Check if updating name and if it already exists (excluding current Category)
    if (name && name !== Category.name) {
        const CategoryExists = await Category.findOne({ name, user: req.user.id });
        if (CategoryExists) {
            res.status(400);
            throw new Error("Category name already exists in your inventory");
        }
    }

    // Update fields
    Category.name = name || Category.name;
    Category.sku = sku !== undefined ? sku : Category.sku;
    
    // Note: Quantity is usually updated via stock operations, but allowing manual override here implementation choice.
    // For strict inventory, maybe disable direct quantity update? 
    // Allowing it for correction purposes, but logging difference would be ideal.
    // For simplicity following user plan likely expects simple CRUD.
    if (quantity !== undefined) {
        const diff = Number(quantity) - Category.quantity;
        if (diff !== 0) {
            await StockHistory.create({
                user: req.user.id,
                CategoryId: Category._id,
                type: diff > 0 ? "IN" : "OUT",
                quantity: Math.abs(diff),
                reason: "Manual Adjustment",
            });
            Category.quantity = quantity;
        }
    }

    const updatedCategory = await Category.save();
    res.status(200).json(updatedCategory);
});

// @desc    Delete Category
// @route   DELETE /api/Categorys/:id
// @access  Private (Admin)
const deleteCategory = asyncHandler(async (req, res) => {
    const Category = await Category.findOne({ _id: req.params.id, user: req.user.id });
    if (!Category) {
        res.status(404);
        throw new Error("Category not found in your inventory");
    }

    // Use deleteOne() instead of remove() which is deprecated
    await Category.deleteOne();
    // Also remove history for this Category
    await StockHistory.deleteMany({ CategoryId: req.params.id, user: req.user.id });

    res.status(200).json({ message: "Category deleted and history cleared" });
});

// @desc    Get Low Stock Categorys
// @route   GET /api/Categorys/low-stock
// @access  Private
const getLowStockCategorys = asyncHandler(async (req, res) => {
    // Find Categorys where quantity is low (<= 5) OR less than or equal to custom minStock
    const Categorys = await Category.find({
        // user: req.user.id,
        $or: [
            { $expr: { $lte: ["$quantity", "$minStock"] } },
            { quantity: { $lte: 5 } }
        ]
    }).sort("quantity");

    res.status(200).json(Categorys);
});

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getLowStockCategorys
};
