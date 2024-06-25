const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const apiRoutes = require("./routes");

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "UPDATE"],
    })
);

app.use("/api", apiRoutes);

module.exports = app;
