const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware, AuthMiddleware } = require("../../middlewares");

const router = express.Router();

// Route to handle user signup
router.post(
    "/signup",
    UserMiddleware.validateSignupRequest, // Middleware to validate signup request
    UserController.signUp // Controller method to handle user signup
);

// Route to handle user signin
router.post(
    "/signin",
    UserMiddleware.validateSigninRequest, // Middleware to validate signin request
    UserController.signIn // Controller method to handle user signin
);

// Route to handle user logout
router.get(
    "/logout",
    AuthMiddleware.verifyJWT, // Middleware to verify JWT token for authentication
    UserController.logout // Controller method to handle user logout
);

module.exports = router;
