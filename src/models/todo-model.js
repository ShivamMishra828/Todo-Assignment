const mongoose = require("mongoose");
const { Enums } = require("../utils/common");
const { COMPLETED, PENDING } = Enums.Todo_Types;

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        status: {
            type: String,
            enum: [PENDING, COMPLETED],
            default: PENDING,
        },
        assignedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
