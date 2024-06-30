const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { TodoService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const fs = require("fs");

// Controller function to create a new todo item
async function createTodo(req, res) {
    try {
        const todo = await TodoService.createTodo({
            title: req.body.title,
            description: req.body.description,
            userId: req.user.id,
        });
        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(todo, "Todo created successfully."));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to create todo.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to fetch all todos for the logged-in user
async function fetchAllTodos(req, res) {
    try {
        const todos = await TodoService.fetchAllTodos(req.user.id);
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(todos, "Fetched all todos."));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to fetch todos.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to fetch a todo by its ID
async function fetchTodoById(req, res) {
    try {
        const todo = await TodoService.fetchTodoById(req.params.todoId);
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(todo, "Todo fetched successfully."));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to fetch todo.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to update todo details by its ID
async function updateTodoDetails(req, res) {
    try {
        const updates = req.updates;
        const todo = await TodoService.updateTodoDetails(
            req.params.todoId,
            updates
        );
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(todo, "Todo updated successfully."));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to update todo.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to update the status of a todo by its ID
async function updateTodoStatus(req, res) {
    try {
        const updatedTodo = await TodoService.updateTodoStatus(
            req.params.todoId
        );
        return res
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    updatedTodo,
                    "Todo status updated successfully."
                )
            );
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to update todo status.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to delete a todo by its ID
async function deleteTodo(req, res) {
    try {
        const response = await TodoService.deleteTodo(
            req.params.todoId,
            req.user.id
        );
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(response, "Todo deleted successfully."));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to delete todo.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to fetch todos based on a filter (e.g., status)
async function fetchFilteredTodo(req, res) {
    try {
        const todos = await TodoService.fetchFilteredTodo(
            req.user.id,
            req.query.status
        );
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(todos, "Todos fetched successfully."));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to fetch filtered todos.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to create multiple todos from a CSV file
async function createManyTodos(req, res) {
    try {
        if (!req.file) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "CSV file not found.",
                            StatusCodes.BAD_REQUEST
                        )
                    )
                );
        }

        const response = await TodoService.createManyTodos(
            req.file.path,
            req.user.id
        );
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(response, "Todos created successfully."));
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message ||
                            "Failed to create todos from CSV file.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function to generate a CSV file of todos for the logged-in user
async function generateTodos(req, res) {
    try {
        const csvFilePath = await TodoService.generateTodos(req.user.id);
        res.download(csvFilePath, "todos.csv", (err) => {
            if (err) {
                console.error("Error downloading the file:", err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
                    "Error downloading the file."
                );
            }
            fs.unlinkSync(csvFilePath);
        });
    } catch (error) {
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to generate CSV file.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

module.exports = {
    createTodo,
    fetchAllTodos,
    fetchTodoById,
    updateTodoDetails,
    updateTodoStatus,
    deleteTodo,
    fetchFilteredTodo,
    createManyTodos,
    generateTodos,
};
