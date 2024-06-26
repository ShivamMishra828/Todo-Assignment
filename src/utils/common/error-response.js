class ErrorResponse {
    constructor(error) {
        this.success = false;
        this.message = "Something went wrong";
        this.data = {};
        this.error = error;
    }
}

module.exports = ErrorResponse;
