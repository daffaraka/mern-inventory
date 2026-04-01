const ManajemenFinanceOnly = (req, res, next) => {
    if (req.user && req.user.role === "finance" || req.user.role === "manajemen") {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as a manajemen atau finance");
    }
}

module.exports = { ManajemenFinanceOnly };