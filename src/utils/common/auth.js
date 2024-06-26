const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../../config");
const AppError = require("../errors/app-error");
const { StatusCodes } = require("http-status-codes");

async function generateJWTToken(payload) {
    try {
        return await jwt.sign(payload, ServerConfig.JWT_SECRET, {
            expiresIn: ServerConfig.JWT_EXPIRY,
        });
    } catch (error) {
        throw new AppError(
            "Failed to generate JWT Token",
            StatusCodes.BAD_REQUEST
        );
    }
}

module.exports = {
    generateJWTToken,
};
