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

module.exports = {
    createTodo,
    fetchAllTodos,
    fetchTodoById,
};
