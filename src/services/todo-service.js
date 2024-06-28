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
        return todo;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "An unexpected error occurred while creating new todo item.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchAllTodos(userId) {
    try {
        const todos = await todoRepository.fetchAll(userId);
        return todos;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "An unexpected error occurred while fetching all todos.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchTodoById(todoId) {
    try {
        const todo = await todoRepository.fetchById(todoId);
        if (!todo) {
            throw new AppError(
                "Todo with given id doesn't exist.",
                StatusCodes.NOT_FOUND
            );
        }

        return todo;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "An unexpected error occurred while fetching todo by id.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function updateTodoDetails(todoId, data) {
    try {
        const updatedTodo = await todoRepository.update(todoId, data);
        return updatedTodo;
    } catch (error) {
        throw new AppError(
            "An unexpected error occurred while updating todo.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function updateTodoStatus(todoId) {
    try {
        const todo = await todoRepository.fetchById(todoId);
        if (!todo) {
            throw new AppError("Todo not found.", StatusCodes.NOT_FOUND);
        }

        const updatedTodo = await todoRepository.updateStatus(todo);
        return updatedTodo;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "An unexpected error occurred while updating todo status.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function deleteTodo(todoId) {
    try {
        const response = await todoRepository.delete(todoId);
        if (!response) {
            throw new AppError("Todo not found", StatusCodes.NOT_FOUND);
        }
        return response;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "An unexpected error occurred while deleting todo.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchFilteredTodo(userId, status) {
    try {
        const todos = await todoRepository.fetchFilteredTodo(userId, status);
        return todos;
    } catch (error) {
        console.log(error);
        throw new AppError(
            "An unexpected error occurred while fetching todo by filter.",
            StatusCodes.INTERNAL_SERVER_ERROR
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
};
