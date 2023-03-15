const mongooseError = (error, data, next) => {
    error.status = 400;
    console.log(error.status)
    next()
};

module.exports = {
    mongooseError
}