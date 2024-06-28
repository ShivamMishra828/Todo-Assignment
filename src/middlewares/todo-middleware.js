const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

async function validateCreateTodoRequest(req, res, next) {
    if (!req.body.title) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError("Title is required.", StatusCodes.BAD_REQUEST)
                )
            );
    }
    if (!req.body.description) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
                new ErrorResponse(
                    new AppError(
                        "Description is required.",
                        StatusCodes.BAD_REQUEST
                    )
                )
            );
    }
    next();
}

async function validateUpdateTodoRequest(req, res, next) {
    let updates = {};
    if (req.body.title) {
        updates.title = req.body.title;
    }
    if (req.body.description) {
        updates.description = req.body.description;
    }
    if (req.body.dueDate) {
        updates.dueDate = new Date(req.body.dueDate);
    }
    req.updates = updates;
    next();
}

module.exports = {
    validateCreateTodoRequest,
    validateUpdateTodoRequest,
};
