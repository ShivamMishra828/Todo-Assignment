const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");

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

module.exports = router;
