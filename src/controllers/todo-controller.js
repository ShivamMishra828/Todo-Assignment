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

module.exports = {
    createTodo,
};
