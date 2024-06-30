const { StatusCodes } = require("http-status-codes");
const { TodoRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const csvParser = require("csv-parser");
const fs = require("fs");
const { isValidObjectId, generateTodosCSV } = require("../helpers");

const todoRepository = new TodoRepository();

async function createTodo(data) {
    try {
        // Create a new todo item
        const todo = await todoRepository.create({
            title: data.title,
            description: data.description,
            assignedUser: data.userId,
        });

        // Update the user's todo list with the new todo
        const updatedUser = await todoRepository.updateUserTodoList(
            data.userId,
            todo._id
        );

        return todo; // Return the created todo item
    } catch (error) {
        console.log(error);
        // Throw an application-specific error for unexpected issues
        throw new AppError(
            "An unexpected error occurred while creating new todo item.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchAllTodos(userId) {
    try {
        // Fetch all todos belonging to the specified user
        const todos = await todoRepository.fetchAll(userId);
        return todos; // Return the fetched todos
    } catch (error) {
        console.log(error);
        // Throw an application-specific error for unexpected issues
        throw new AppError(
            "An unexpected error occurred while fetching all todos.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function fetchTodoById(todoId) {
    try {
        // Fetch a todo by its ID
        const todo = await todoRepository.fetchById(todoId);

        // If todo is not found, throw a not found error
        if (!todo) {
            throw new AppError(
                "Todo with given id doesn't exist.",
                StatusCodes.NOT_FOUND
            );
        }

        return todo; // Return the fetched todo
    } catch (error) {
        // Handle specific errors and throw appropriate application errors
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
        // Update details of a todo by its ID
        const updatedTodo = await todoRepository.update(todoId, data);

        // If todo is not found, throw a not found error
        if (!updatedTodo) {
            throw new AppError("Todo not found", StatusCodes.NOT_FOUND);
        }

        return updatedTodo; // Return the updated todo
    } catch (error) {
        // Handle specific errors and throw appropriate application errors
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
        // Fetch a todo by its ID
        const todo = await todoRepository.fetchById(todoId);

        // If todo is not found, throw a not found error
        if (!todo) {
            throw new AppError("Todo not found.", StatusCodes.NOT_FOUND);
        }

        // Update the status of the todo
        const updatedTodo = await todoRepository.updateStatus(todo);
        return updatedTodo; // Return the updated todo
    } catch (error) {
        // Handle specific errors and throw appropriate application errors
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "An unexpected error occurred while updating todo status.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function deleteTodo(todoId, userId) {
    try {
        // Delete a todo by its ID
        const response = await todoRepository.delete(todoId, userId);

        // If todo is not found, throw a not found error
        if (!response) {
            throw new AppError("Todo not found", StatusCodes.NOT_FOUND);
        }

        return response; // Return the deletion response
    } catch (error) {
        // Handle specific errors and throw appropriate application errors
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
        // Fetch todos filtered by user ID and status
        const todos = await todoRepository.fetchFilteredTodo(userId, status);
        return todos; // Return the filtered todos
    } catch (error) {
        console.log(error);
        // Throw an application-specific error for unexpected issues
        throw new AppError(
            "An unexpected error occurred while fetching todo by filter.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function createManyTodos(filePath, userId) {
    try {
        const todos = [];

        // Read CSV file and parse rows
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on("data", (row) => {
                    // Validate and clean the data from CSV
                    const cleanedRow = {
                        title: row.title || "",
                        description: row.description || "",
                        dueDate: row.dueDate
                            ? new Date(row.dueDate)
                            : new Date(7 * 24 * 60 * 60 * 1000),
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

                    // Only push valid todos to the array
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
            // Create multiple todos in the database
            const insertedTodos = await todoRepository.createMany(todos);

            // Extract the IDs of the newly inserted todos
            const todoIds = insertedTodos.map((todo) => todo._id);

            // Update the user document by pushing the todo IDs into the todos field
            await todoRepository.addTodosToUser(userId, todoIds);

            // Remove the CSV file after successful database insertion
            fs.unlinkSync(filePath);

            return insertedTodos; // Return the inserted todos
        } else {
            // Throw an error if no valid todos were found in the CSV
            throw new AppError(
                "No valid todos to import",
                StatusCodes.BAD_REQUEST
            );
        }
    } catch (error) {
        console.log(error);
        // Throw an application-specific error for unexpected issues
        throw new AppError(
            "An unexpected error occurred while creating todos.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function generateTodos(userId) {
    try {
        // Fetch all todos belonging to the specified user
        const todos = await todoRepository.fetchAll(userId);

        // Throw an error if no todos are found for the user
        if (!todos.length) {
            throw new AppError("No todos found", StatusCodes.NOT_FOUND);
        }

        // Generate CSV file with todos data
        const response = await generateTodosCSV(todos);
        return response; // Return the path to the generated CSV file
    } catch (error) {
        console.log(error);
        // Handle specific errors and throw appropriate application errors
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }
        throw new AppError(
            "An unexpected error occurred while downloading todos.",
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
    generateTodos,
};
