const CrudRepository = require("./crud-repository");
const { Todo, User } = require("../models");

class TodoRepository extends CrudRepository {
    constructor() {
        super(Todo);
    }

    async updateUserTodoList(userId, taskId) {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    tasks: taskId,
                },
            },
            { new: true }
        ).select("-password");
        return updatedUser;
    }
}

module.exports = TodoRepository;
