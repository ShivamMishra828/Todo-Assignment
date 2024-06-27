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
}

module.exports = TodoRepository;
