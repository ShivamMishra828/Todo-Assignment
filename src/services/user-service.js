const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Auth } = require("../utils/common");

const userRepository = new UserRepository();

async function signUp(data) {
    try {
        // Check if a user with the given email already exists
        const existingUser = await userRepository.getUserByEmail(data.email);
        if (existingUser) {
            throw new AppError(
                "Email already exists. Please use a different email.",
                StatusCodes.BAD_REQUEST
            );
        }

        // Create a new user with the provided data
        const user = await userRepository.create(data);
        return user;
    } catch (error) {
        // Handle validation errors
        if (error.name == "ValidationError") {
            throw new AppError(
                `Validation Error: ${error._message}`,
                StatusCodes.UNPROCESSABLE_ENTITY
            );
        }

        // Handle known application errors
        if (error.statusCode == StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "An unexpected error occurred while signing up the user.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function signIn(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError(
                "Email doesn't exists. Please use a different email.",
                StatusCodes.BAD_REQUEST
            );
        }

        const isPasswordValid = await user.checkPassword(data.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid Credentials", StatusCodes.BAD_REQUEST);
        }

        const payload = {
            id: user._id,
            email: user.email,
        };

        const token = await Auth.generateJWTToken(payload);
        if (!token) {
            throw new AppError(
                "JWT Token not generated.",
                StatusCodes.BAD_REQUEST
            );
        }

        return token;
    } catch (error) {
        if (error.statusCode == StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        throw new AppError(
            "An unexpected error occurred while signing in the user.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    signUp,
    signIn,
};
