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
        return user; // Return the created user
    } catch (error) {
        // Handle validation errors from Mongoose
        if (error.name == "ValidationError") {
            throw new AppError(
                `Validation Error: ${error._message}`,
                StatusCodes.UNPROCESSABLE_ENTITY
            );
        }

        // Handle known application errors with specific HTTP status codes
        if (error.statusCode == StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        // Throw an application-specific error for unexpected issues
        throw new AppError(
            "An unexpected error occurred while signing up the user.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function signIn(data) {
    try {
        // Find user by email in the database
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError(
                "Email doesn't exist. Please use a different email.",
                StatusCodes.BAD_REQUEST
            );
        }

        // Check if the provided password matches the user's stored password
        const isPasswordValid = await user.checkPassword(data.password);
        if (!isPasswordValid) {
            throw new AppError(
                "Invalid credentials. Please try again.",
                StatusCodes.BAD_REQUEST
            );
        }

        // Generate a JWT token for the authenticated user
        const payload = {
            id: user._id,
            email: user.email,
        };
        const token = await Auth.generateJWTToken(payload);
        if (!token) {
            throw new AppError(
                "Failed to generate JWT token. Please try again.",
                StatusCodes.BAD_REQUEST
            );
        }

        return token; // Return the JWT token
    } catch (error) {
        // Handle known application errors with specific HTTP status codes
        if (error.statusCode == StatusCodes.BAD_REQUEST) {
            throw new AppError(error.explanation, error.statusCode);
        }

        // Throw an application-specific error for unexpected issues
        throw new AppError(
            "An unexpected error occurred while signing in the user.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function verifyJWT(data) {
    try {
        // Verify the JWT token and retrieve user details
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new AppError(
                "User corresponding to token doesn't exist.",
                StatusCodes.NOT_FOUND
            );
        }

        return user; // Return the user corresponding to the token
    } catch (error) {
        // Handle known application errors with specific HTTP status codes
        if (error.statusCode == StatusCodes.NOT_FOUND) {
            throw new AppError(error.explanation, error.statusCode);
        }

        // Throw an application-specific error for unexpected issues
        throw new AppError(
            "An unexpected error occurred while verifying the token.",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

module.exports = {
    signUp,
    signIn,
    verifyJWT,
};
