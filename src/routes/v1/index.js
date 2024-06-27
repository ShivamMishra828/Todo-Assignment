const express = require("express");
const userRoutes = require("./user-route");
const todoRoutes = require("./todo-route");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/todos", todoRoutes);

module.exports = router;
