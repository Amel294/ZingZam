exports.isUserCheck = async (req, res, next) => {
    try {
        const userRole = req.userData?.role;
        if (userRole !== 'user') {
            return res.status(403).json({
                isUser: false
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