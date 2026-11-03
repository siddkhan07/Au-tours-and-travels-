
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "*"
}));
app.use(express.json({ limit: "10kb" }));

app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
}));

// Booking Database Model
const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    destination: {
        type: String,
        required: true
    },
    travelDate: {
        type: Date,
        required: true
    },
    travellers: {
        type: String,
        required: true
    },
    message: {
        type: String,
        maxlength: 1000,
        default: ""
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled"],
        default: "Pending"
    }
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", bookingSchema);

// Home route
app.get("/", (req, res) => {
    res.send("AU Tours & Travels Backend is Running!");
});

// Database health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        database: mongoose.connection.readyState === 1
            ? "Connected"
            : "Disconnected"
    });
});

// Create booking
app.post("/api/bookings", async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            destination,
            travelDate,
            travellers,
            message
        } = req.body;

        if (
            !name || !phone || !email ||
            !destination || !travelDate || !travellers
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const booking = await Booking.create({
            name,
            phone,
            email,
            destination,
            travelDate,
            travellers,
            message
        });

        res.status(201).json({
            success: true,
            message: "Booking request submitted successfully!",
            bookingId: booking._id
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Booking could not be submitted. Please check your details."
        });
    }
});

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    });
