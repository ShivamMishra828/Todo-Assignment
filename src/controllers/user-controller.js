const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");

async function signUp(req, res) {
    try {
        // Extract user data from the request body
        const user = await UserService.signUp({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
        });

        // Respond with the created user and a success message
        return res
            .status(StatusCodes.CREATED)
            .json(new SuccessResponse(user, "User created successfully."));
    } catch (error) {
        // Respond with the error details
        return res
            .status(error.statusCode)
            .json(
                new ErrorResponse(
                    error,
                    error.explanation || "Failed to create user."
                )
            );
    }
}

module.exports = {
    signUp,
};
