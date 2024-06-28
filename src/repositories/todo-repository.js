const CrudRepository = require("./crud-repository");
const { Todo, User } = require("../models");

class TodoRepository extends CrudRepository {
    constructor() {
        super(Todo);
    }

    async updateUserTodoList(userId, todoId) {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    todos: todoId,
                },
            },
            { new: true }
        ).select("-password");
        return updatedUser;
    }

    async fetchAll(userId) {
        const user = await User.findById(userId).populate("todos");
        return user.todos;
    }

    async updateStatus(todo) {
        const updatedTodo =
            todo.status == "pending"
                ? await Todo.findByIdAndUpdate(
                      todo._id,
                      { $set: { status: "completed" } },
                      { new: true }
                  )
                : await Todo.findByIdAndUpdate(
                      todo._id,
                      { $set: { status: "pending" } },
                      { new: true }
                  );
        return updatedTodo;
    }

    async fetchFilteredTodo(userId, status) {
        const todos = await Todo.find({ assignedUser: userId, status });
        return todos;
    }
}

module.exports = TodoRepository;
