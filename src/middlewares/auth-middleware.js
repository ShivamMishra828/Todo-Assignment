const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, Auth } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

// Middleware to verify the JWT token for authentication
async function verifyJWT(req, res, next) {
    try {
        // Extract token from cookies or Authorization header
        const token =
            req.cookies.token || req.headers["Authorization"]?.split(" ")[1];

        // Check if token is not present
        if (!token) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "Token not found. Authorization denied.",
                            StatusCodes.UNAUTHORIZED
                        )
                    )
                );
        }

        // Decode the token to get user data
        const decodedData = await Auth.decodeToken(token);
        if (!decodedData) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ErrorResponse(
                        new AppError(
                            "Invalid JWT token. Authorization denied.",
                            StatusCodes.UNAUTHORIZED
                        )
                    )
                );
        }

        // Verify the user based on decoded token data
        const user = await UserService.verifyJWT(decodedData);
        req.user = user;
        next();
    } catch (error) {
        // Respond with the error details
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
                new ErrorResponse(
                    new AppError(
                        error.message || "Internal server error.",
                        StatusCodes.INTERNAL_SERVER_ERROR
                    )
                )
            );
    }
}

module.exports = {
    verifyJWT,
};
