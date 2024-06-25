class SuccessResponse {
    constructor(data, message) {
        this.success = true;
        this.message = message || "Successfully completed the request";
        this.data = data;
        this.error = {};
    }
}

module.exports = SuccessResponse;
