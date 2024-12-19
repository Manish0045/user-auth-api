class CustomError extends Error {
    constructor(statusCode = 500, message = "Something went wrong!") {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = { CustomError };