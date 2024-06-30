const express = require("express");
const { TodoController } = require("../../controllers");
const { AuthMiddleware, TodoMiddleware, Multer } = require("../../middlewares");

const router = express.Router();

// Middleware to verify JWT token for authentication
router.use(AuthMiddleware.verifyJWT);

// Route to create a new todo item
router.post(
    "/",
    TodoMiddleware.validateCreateTodoRequest, // Middleware to validate create todo request
    TodoController.createTodo // Controller method to handle create todo request
);

// Route to download todos as CSV
router.get("/download", TodoController.generateTodos);

// Route to fetch filtered todos
router.get("/filter", TodoController.fetchFilteredTodo);

// Route to fetch all todos
router.get("/", TodoController.fetchAllTodos);

// Route to fetch a todo by its ID
router.get("/:todoId", TodoController.fetchTodoById);

// Route to update details of a todo by its ID
router.put(
    "/:todoId",
    TodoMiddleware.validateUpdateTodoRequest, // Middleware to validate update todo request
    TodoController.updateTodoDetails // Controller method to handle update todo details
);

// Route to update status of a todo by its ID
router.patch("/:todoId", TodoController.updateTodoStatus);

// Route to delete a todo by its ID
router.delete("/:todoId", TodoController.deleteTodo);

// Route to upload todos from a CSV file
router.post("/upload", Multer.single("file"), TodoController.createManyTodos);

module.exports = router;
