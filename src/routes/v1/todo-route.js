const express = require("express");
const { TodoController } = require("../../controllers");
const { AuthMiddleware, TodoMiddleware } = require("../../middlewares");

const router = express.Router();

router.use(AuthMiddleware.verifyJWT);
router.post(
    "/",
    TodoMiddleware.validateCreateTodoRequest,
    TodoController.createTodo
);
router.get("/", TodoController.fetchAllTodos);
router.get("/:todoId", TodoController.fetchTodoById);
router.put(
    "/:todoId",
    TodoMiddleware.validateUpdateTodoRequest,
    TodoController.updateTodoDetails
);

module.exports = router;
