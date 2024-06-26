const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, Auth } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { UserService } = require("../services");

async function verifyJWT(req, res, next) {
    try {
        const token =
            req.cookies.token || req.headers["Authorization"]?.split(" ")[1];

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

        const user = await UserService.verifyJWT(decodedData);
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(new ErrorResponse(error));
    }
}

module.exports = {
    verifyJWT,
};
