const express = require("express");
const { TodoController } = require("../../controllers");
const { AuthMiddleware, TodoMiddleware, Multer } = require("../../middlewares");

const router = express.Router();

router.use(AuthMiddleware.verifyJWT);
router.post(
    "/",
    TodoMiddleware.validateCreateTodoRequest,
    TodoController.createTodo
);
router.get("/download", TodoController.generateTodos);
router.get("/filter", TodoController.fetchFilteredTodo);
router.get("/", TodoController.fetchAllTodos);
router.get("/:todoId", TodoController.fetchTodoById);
router.put(
    "/:todoId",
    TodoMiddleware.validateUpdateTodoRequest,
    TodoController.updateTodoDetails
);
router.patch("/:todoId", TodoController.updateTodoStatus);
router.delete("/:todoId", TodoController.deleteTodo);
router.post("/upload", Multer.single("file"), TodoController.createManyTodos);

module.exports = router;
