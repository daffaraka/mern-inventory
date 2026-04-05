const asyncHandler = require("../utils/AsyncHandler");
const Product = require("../models/ProductModel");
const StockHistory = require("../models/StockHistoryModel");

// @desc    Stock In - Staff input (status: pending)
// @route   POST /api/stock/in
// @access  Private (staff, admin)
const stockIn = asyncHandler(async (req, res) => {
    const { productId, quantity, reason, inputBy } = req.body;

    if (!quantity || quantity <= 0) {
        res.status(400);
        throw new Error("Invalid quantity");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    const history = await StockHistory.create({
        user: req.user.id,
        productId,
        type: "IN",
        quantity,
        reason,
        status: "pending",
        inputBy: inputBy || req.user.id,
    });

    res.status(201).json({ message: "Stock In request submitted, awaiting Finance approval", history });
});

// @desc    Stock Out - Staff input (status: pending)
// @route   POST /api/stock/out
// @access  Private (staff, admin)
const stockOut = asyncHandler(async (req, res) => {
    const { productId, quantity, reason, salesOrderNumber, inputBy } = req.body;

    if (!quantity || quantity <= 0) {
        res.status(400);
        throw new Error("Invalid quantity");
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    if (product.quantity < quantity) {
        res.status(400);
        throw new Error("Insufficient stock");
    }

    const history = await StockHistory.create({
        user: req.user.id,
        productId,
        type: "OUT",
        quantity,
        reason,
        salesOrderNumber,
        status: "pending",
        inputBy: inputBy || req.user.id,
    });

    res.status(201).json({ message: "Stock Out request submitted, awaiting Management approval", history });
});

// @desc    Approve Stock In - Finance
// @route   PATCH /api/stock/:id/approve
// @access  Private (finance) - Stock In only
const approveStockIn = asyncHandler(async (req, res) => {
    const history = await StockHistory.findById(req.params.id);

    if (!history) {
        res.status(404);
        throw new Error("Stock record not found");
    }
    if (history.type !== "IN") {
        res.status(400);
        throw new Error("This endpoint is for Stock In approval only");
    }
    if (history.status !== "pending") {
        res.status(400);
        throw new Error(`Cannot approve. Current status: ${history.status}`);
    }

    // Apply stock change to product
    const product = await Product.findById(history.productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    product.quantity += Number(history.quantity);
    await product.save();

    history.status = "approved";
    history.approvedBy = req.user.id;
    await history.save();

    res.status(200).json({ message: "Stock In approved by Finance", history });
});

// @desc    Acknowledge Stock In - Management
// @route   PATCH /api/stock/:id/acknowledge
// @access  Private (management) - Stock In only
const acknowledgeStockIn = asyncHandler(async (req, res) => {
    const history = await StockHistory.findById(req.params.id);

    if (!history) {
        res.status(404);
        throw new Error("Stock record not found");
    }
    if (history.type !== "IN") {
        res.status(400);
        throw new Error("This endpoint is for Stock In acknowledgement only");
    }
    if (history.status !== "approved") {
        res.status(400);
        throw new Error(`Cannot acknowledge. Must be approved first. Current status: ${history.status}`);
    }

    history.status = "acknowledged";
    history.validatedBy = req.user.id;
    await history.save();

    res.status(200).json({ message: "Stock In acknowledged by Management", history });
});

// @desc    Approve Stock Out - Management
// @route   PATCH /api/stock/:id/approve-out
// @access  Private (management) - Stock Out only
const approveStockOut = asyncHandler(async (req, res) => {
    const history = await StockHistory.findById(req.params.id);

    if (!history) {
        res.status(404);
        throw new Error("Stock record not found");
    }
    if (history.type !== "OUT") {
        res.status(400);
        throw new Error("This endpoint is for Stock Out approval only");
    }
    if (history.status !== "pending") {
        res.status(400);
        throw new Error(`Cannot approve. Current status: ${history.status}`);
    }

    // Apply stock change to product
    const product = await Product.findById(history.productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    if (product.quantity < history.quantity) {
        res.status(400);
        throw new Error("Insufficient stock at time of approval");
    }
    product.quantity -= Number(history.quantity);
    await product.save();

    history.status = "approved";
    history.approvedBy = req.user.id;
    await history.save();

    res.status(200).json({ message: "Stock Out approved by Management", history });
});

// @desc    Acknowledge Stock Out - Finance
// @route   PATCH /api/stock/:id/acknowledge-out
// @access  Private (finance) - Stock Out only
const acknowledgeStockOut = asyncHandler(async (req, res) => {
    const history = await StockHistory.findById(req.params.id);

    if (!history) {
        res.status(404);
        throw new Error("Stock record not found");
    }
    if (history.type !== "OUT") {
        res.status(400);
        throw new Error("This endpoint is for Stock Out acknowledgement only");
    }
    if (history.status !== "approved") {
        res.status(400);
        throw new Error(`Cannot acknowledge. Must be approved first. Current status: ${history.status}`);
    }

    history.status = "acknowledged";
    history.validatedBy = req.user.id;
    await history.save();

    res.status(200).json({ message: "Stock Out acknowledged by Finance", history });
});

// @desc    Reject a stock request
// @route   PATCH /api/stock/:id/reject
// @access  Private (finance, management)
const rejectStock = asyncHandler(async (req, res) => {
    const { rejectNote } = req.body;
    const history = await StockHistory.findById(req.params.id);

    if (!history) {
        res.status(404);
        throw new Error("Stock record not found");
    }
    if (history.status !== "pending") {
        res.status(400);
        throw new Error(`Cannot reject. Current status: ${history.status}`);
    }

    history.status = "rejected";
    history.rejectedBy = req.user.id;
    history.rejectNote = rejectNote || "No reason provided";
    await history.save();

    res.status(200).json({ message: "Stock request rejected", history });
});

// @desc    Get Stock History
// @route   GET /api/stock/history
// @access  Private
const getStockHistory = asyncHandler(async (req, res) => {
    const { type } = req.query;
    const filter = {};
    if (type) filter.type = type;

    const history = await StockHistory.find(filter)
        .populate("productId", "name")
        .populate("user", "name role")
        .populate("inputBy", "name role")
        .populate("approvedBy", "name role")
        .populate("validatedBy", "name role")
        .populate("rejectedBy", "name role")
        .sort("-createdAt");

    const result = history.map(item => ({
        ...item.toObject(),
        product: item.productId,
    }));

    res.status(200).json(result);
});

module.exports = {
    stockIn,
    stockOut,
    approveStockIn,
    acknowledgeStockIn,
    approveStockOut,
    acknowledgeStockOut,
    rejectStock,
    getStockHistory,
};
