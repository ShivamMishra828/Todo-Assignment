const CrudRepository = require("./crud-repository");
const { Todo, User } = require("../models");

class TodoRepository extends CrudRepository {
    constructor() {
        super(Todo); // Initialize the CrudRepository with the Todo model
    }

    // Method to update the user's todo list with a new todo
    async updateUserTodoList(userId, todoId) {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    todos: todoId,
                },
            },
            { new: true } // Return the updated user document
        ).select("-password"); // Exclude password field from the returned user document
        return updatedUser;
    }

    // Method to fetch all todos associated with a user
    async fetchAll(userId) {
        const user = await User.findById(userId).populate("todos"); // Populate the todos field in the user document
        return user.todos; // Return the populated todos array
    }

    // Method to update the status of a todo item
    async updateStatus(todo) {
        const updatedTodo =
            todo.status == "pending"
                ? await Todo.findByIdAndUpdate(
                      todo._id,
                      { $set: { status: "completed" } },
                      { new: true } // Return the updated todo document
                  )
                : await Todo.findByIdAndUpdate(
                      todo._id,
                      { $set: { status: "pending" } },
                      { new: true } // Return the updated todo document
                  );
        return updatedTodo;
    }

    // Method to delete todo and also remove todoId from user's model
    async delete(todoId, userId) {
        const response = await Todo.findByIdAndDelete(todoId);
        await User.findByIdAndUpdate(userId, {
            $pull: {
                todos: todoId,
            },
        });
        return response;
    }

    // Method to fetch todos filtered by user ID and status
    async fetchFilteredTodo(userId, status) {
        const todos = await Todo.find({ assignedUser: userId, status }); // Find todos based on user ID and status
        return todos;
    }

    // Method to add multiple todos to a user
    async addTodosToUser(userId, todoIds) {
        await User.findByIdAndUpdate(
            userId,
            { $push: { todos: { $each: todoIds } } }, // Add multiple todos to the user's todos array
            { new: true } // Return the updated user document
        );
    }
}

module.exports = TodoRepository;
