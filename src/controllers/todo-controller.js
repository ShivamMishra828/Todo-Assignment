const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { TodoService } = require("../services");
const { StatusCodes } = require("http-status-codes");

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
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

async function fetchAllTodos(req, res) {
    try {
        const todos = await TodoService.fetchAllTodos(req.user.id);
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(todos, "Fetched all todos."));
    } catch (error) {
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

async function fetchTodoById(req, res) {
    try {
        const todo = await TodoService.fetchTodoById(req.params.todoId);
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(todo, "Todo fetched successfully."));
    } catch (error) {
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

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
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

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
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

async function deleteTodo(req, res) {
    try {
        const response = await TodoService.deleteTodo(req.params.todoId);
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(response, "Todo deleted successfully."));
    } catch (error) {
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

async function fetchFilteredTodo(req, res) {
    try {
        const todos = await TodoService.fetchFilteredTodo(
            req.user.id,
            req.query.status
        );
        return res
            .status(StatusCodes.OK)
            .json(new SuccessResponse(todos, "Todo fetched successfully."));
    } catch (error) {
        return res.status(error.statusCode).json(new ErrorResponse(error));
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
};
