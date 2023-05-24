const errorHandlerMiddleware = (err, req, res, next) => {
    const status = err.status || 400;
    res.status(status).send({error: `${err.message}`});
};

module.exports = { errorHandlerMiddleware }