const { ValidationError } = require("joi");

const errorHandler = (err, req, res, next) => {
    let status = 500;
    let data = { message: "internal server error" };

    if (err instanceof ValidationError) {
        status = err.status || 400;
        data.message = err.message;
        return res.status(status).json(data);
    }

    if (err.status !== undefined) {
        status = err.status;
    }

    if (err.message) {
        data.message = err.message;
    }

    return res.status(status).json(data);
};

module.exports = errorHandler;