class ErrorResponse {
    constructor(error, message) {
        this.success = false;
        this.message = message || "Something went wrong";
        this.data = {};
        this.error = error;
    }
}

module.exports = ErrorResponse;
