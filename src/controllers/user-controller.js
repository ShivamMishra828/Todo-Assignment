const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

// Controller function for user sign-up
async function signUp(req, res) {
    try {
        // Extract user data from the request body and create a new user
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
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to create user.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function for user sign-in
async function signIn(req, res) {
    try {
        // Authenticate the user and generate a JWT token
        const token = await UserService.signIn({
            email: req.body.email,
            password: req.body.password,
        });

        // Set the JWT token as an HTTP-only cookie and respond with success
        return res
            .cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 60 * 60 * 1000), // Token expires in 1 hour
            })
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    { jwtToken: token },
                    "User signed in successfully."
                )
            );
    } catch (error) {
        // Respond with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to sign in user.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

// Controller function for user logout
async function logout(req, res) {
    try {
        // Clear the JWT token cookie and respond with success
        return res
            .clearCookie("token", {
                httpOnly: true,
                secure: true,
            })
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "User logged out successfully."));
    } catch (error) {
        // Respond with the error details
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Failed to log out user.",
                        error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

module.exports = {
    signUp,
    signIn,
    logout,
};
