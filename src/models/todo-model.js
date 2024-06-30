const mongoose = require("mongoose");
const { Enums } = require("../utils/common");
const { COMPLETED, PENDING } = Enums.Todo_Types;

// Define the schema for a Todo item
const todoSchema = new mongoose.Schema(
    {
        // The title of the todo item
        title: {
            type: String,
            required: true,
        },
        // The description of the todo item
        description: {
            type: String,
            required: true,
        },
        // The due date for the todo item
        dueDate: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        // The status of the todo item
        status: {
            type: String,
            enum: [PENDING, COMPLETED],
            default: PENDING,
        },
        // Reference to the user assigned to the todo item
        assignedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create the Todo model using the schema
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
