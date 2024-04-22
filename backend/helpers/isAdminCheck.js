exports.isAdminCheck = async (req, res, next) => {
    try {
        const userRole = req.adminData?.role;
        if (userRole !== 'admin') {
            return res.status(403).json({
                isAdmin: false
            });
        }
        else {
            next()
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};