const express = require("express");
const router = express.Router();
const {
    stockIn,
    stockOut,
    approveStockIn,
    acknowledgeStockIn,
    approveStockOut,
    acknowledgeStockOut,
    rejectStock,
    getStockHistory,
} = require("../controllers/StockController");
const { protect } = require("../middlewares/ProtectRouters");
const { financeOnly, managementOnly } = require("../middlewares/ManajemenPengadaan");

// Staff input
router.post("/in", protect, stockIn);
router.post("/out", protect, stockOut);

// Stock In flow: Finance approve → Management acknowledge
router.patch("/:id/approve", protect, financeOnly, approveStockIn);
router.patch("/:id/acknowledge", protect, managementOnly, acknowledgeStockIn);

// Stock Out flow: Management approve → Finance acknowledge
router.patch("/:id/approve-out", protect, managementOnly, approveStockOut);
router.patch("/:id/acknowledge-out", protect, financeOnly, acknowledgeStockOut);

// Reject (finance or management)
router.patch("/:id/reject", protect, rejectStock);

// History
router.get("/history", protect, getStockHistory);

module.exports = router;
