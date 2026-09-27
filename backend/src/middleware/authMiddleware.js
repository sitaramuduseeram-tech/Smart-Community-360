const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {

        // =========================================
        // GET AUTHORIZATION HEADER
        // =========================================

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });

        }


        // =========================================
        // EXTRACT TOKEN
        // =========================================

        const token = authHeader.split(" ")[1];


        // =========================================
        // VERIFY TOKEN
        // =========================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // =========================================
        // FIND USER
        // =========================================

        const user = await User.findById(decoded.id)
            .select("-password");


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });

        }


        // =========================================
        // CHECK ACCOUNT STATUS
        // =========================================

        if (!user.isActive) {

            return res.status(403).json({
                success: false,
                message: "User account is inactive"
            });

        }


        // =========================================
        // ATTACH USER TO REQUEST
        // =========================================

        req.user = user;


        // Continue to next function
        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
};


module.exports = protect;