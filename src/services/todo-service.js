const { StatusCodes } = require("http-status-codes");
const { TodoRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const csvParser = require("csv-parser");
const fs = require("fs");
const { isValidObjectId } = require("../helpers");

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
        if (!updatedTodo) {
            throw new AppError("Todo not found", StatusCodes.NOT_FOUND);
        }
        return updatedTodo;
    } catch (error) {
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
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

async function createManyTodos(filePath, userId) {
    try {
        const todos = [];

        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (row) => {
                    // Validate and clean the data
                    const cleanedRow = {
                        title: row.title || "",
                        description: row.description || "",
                        dueDate: row.dueDate
                            ? new Date(row.dueDate)
                            : new Date(7 * 24 * 60 * 1000),
                        status: ["pending", "completed"].includes(row.status)
                            ? row.status
                            : "pending",
                        assignedUser: isValidObjectId(row.assignedUser)
                            ? row.assignedUser
                            : null,
                        createdAt: row.createdAt
                            ? new Date(row.createdAt)
                            : new Date(),
                        updatedAt: row.updatedAt
                            ? new Date(row.updatedAt)
                            : new Date(),
                    };

                    // Only push valid todos
                    if (
                        cleanedRow.title &&
                        cleanedRow.description &&
                        cleanedRow.dueDate &&
                        cleanedRow.assignedUser
                    ) {
                        todos.push(cleanedRow);
                    }
                })
                .on("end", () => resolve())
                .on("error", (error) => reject(error));
        });

        if (todos.length > 0) {
            const insertedTodos = await todoRepository.createMany(todos);

            // Extract the IDs of the newly inserted todos
            const todoIds = insertedTodos.map((todo) => todo._id);

            // Update the user document by pushing the todo IDs into the todos field
            await todoRepository.addTodosToUser(userId, todoIds);

            // Remove the CSV file after successful database insertion
            fs.unlinkSync(filePath);
            return insertedTodos;
        } else {
            throw new AppError(
                "No valid todos to import",
                StatusCodes.BAD_REQUEST
            );
        }
    } catch (error) {
        console.log(error);
        throw new AppError(
            "An unexpected error occurred while creating todos.",
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
    createManyTodos,
};
