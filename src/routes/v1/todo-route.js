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

module.exports = router;
