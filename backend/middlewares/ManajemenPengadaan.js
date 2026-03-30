const ManajemenPengadaanOnly = (req, res, next) => {
    if (req.user && req.user.role === "pengadaan" || req.user.role === "manajemen") {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as a manajemen atau pengadaan");
    }
}

module.exports = { ManajemenPengadaanOnly };