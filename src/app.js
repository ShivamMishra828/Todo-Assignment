const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const apiRoutes = require("./routes"); // Importing the API routes defined in ./routes

const app = express();

// Middleware to parse JSON bodies, limit to 10kb
app.use(express.json({ limit: "10kb" }));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// CORS middleware configuration
app.use(
    cors({
        credentials: true, // Allows sending cookies across domains
        origin: "*", // Allow requests from any origin (replace with specific origin in production)
        methods: ["GET", "POST", "PUT", "PATCH", "UPDATE"], // Allowed HTTP methods
    })
);

// Mounting API routes under /api
app.use("/api", apiRoutes);

module.exports = app;
