const financeOnly = (req, res, next) => {
    if (req.user && (req.user.role === "finance" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized. Finance role required.");
    }
};

const managementOnly = (req, res, next) => {
    if (req.user && (req.user.role === "management" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized. Management role required.");
    }
};

module.exports = { financeOnly, managementOnly };
