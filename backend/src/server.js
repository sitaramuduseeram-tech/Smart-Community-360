const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// MONGODB CONNECTION
// ==========================================

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("========================================");
        console.log(" MongoDB Atlas Connected Successfully");
        console.log("========================================");
    } catch (error) {
        console.error("MongoDB connection failed");
        console.error(error.message);

        process.exit(1);
    }
};

// ==========================================
// BASIC ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Community 360° Backend is running successfully!"
    });
});

// ==========================================
// HEALTH CHECK API
// ==========================================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "OK",
        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected",
        message: "Smart Community 360° API is healthy"
    });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log("========================================");
        console.log(" Smart Community 360° Backend");
        console.log("========================================");
        console.log(`Server running on: http://localhost:${PORT}`);
        console.log(`Health API: http://localhost:${PORT}/api/health`);
        console.log("========================================");
    });
};

startServer();