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
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

async function signIn(req, res) {
    try {
        const token = await UserService.signIn({
            email: req.body.email,
            password: req.body.password,
        });

        return res
            .cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 60 * 60 * 1000),
            })
            .status(StatusCodes.OK)
            .json(
                new SuccessResponse(
                    { jwtToken: token },
                    "User signin successfully."
                )
            );
    } catch (error) {
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

async function logout(req, res) {
    try {
        return res
            .clearCookie("token", {
                httpOnly: true,
                secure: true,
            })
            .status(StatusCodes.OK)
            .json(new SuccessResponse({}, "User logged out successfully."));
    } catch (error) {
        return res.status(error.statusCode).json(new ErrorResponse(error));
    }
}

module.exports = {
    signUp,
    signIn,
    logout,
};
