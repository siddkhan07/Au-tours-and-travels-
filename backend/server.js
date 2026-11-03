
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5500"
}));

app.use(express.json());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests. Please try again later."
}));

// Test route
app.get("/", (req, res) => {
    res.send("AU Tours & Travels Backend is Running!");
});

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "AU Tours & Travels API is working!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
