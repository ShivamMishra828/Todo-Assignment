const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware, AuthMiddleware } = require("../../middlewares");

const router = express.Router();

router.post(
    "/signup",
    UserMiddleware.validateSignupRequest,
    UserController.signUp
);
router.post(
    "/signin",
    UserMiddleware.validateSigninRequest,
    UserController.signIn
);
router.get("/logout", AuthMiddleware.verifyJWT, UserController.logout);

module.exports = router;
