const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================================================
// REGISTER USER
// =====================================================
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            address,
            city
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, phone and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            address: address || "",
            city: city || ""
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                city: user.city,
                points: user.points
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};


// =====================================================
// LOGIN USER
// =====================================================
const loginUser = async (req, res) => {

    console.log("LOGIN API CALLED");
    console.log("Email received:", req.body.email);

    try {
        const {
            email,
            password
        } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Send login response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                city: user.city,
                points: user.points
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


// =====================================================
// GET CURRENT LOGGED-IN USER
// =====================================================
const getCurrentUser = async (req, res) => {
    try {

        const user = await User
            .findById(req.user.id)
            .select("-password");

        // User not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Send user information
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                address: user.address,
                city: user.city,
                profileImage: user.profileImage,
                points: user.points,
                isActive: user.isActive
            }
        });

    } catch (error) {
        console.error(
            "Get current user error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error while fetching user"
        });
    }
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================
module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};