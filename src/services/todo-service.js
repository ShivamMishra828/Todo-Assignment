const { StatusCodes } = require("http-status-codes");
const { TodoRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");

const todoRepository = new TodoRepository();

async function createTodo(data) {
    try {
        const todo = await todoRepository.create({
            title: data.title,
            description: data.description,
            assignedUser: data.userId,
        });
        const updatedUser = await todoRepository.updateUserTodoList(
            data.userId,
            todo._id
        );
        console.log(updatedUser);
        return todo;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "An unexpected error occurred while creating new todo item.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    createTodo,
};
