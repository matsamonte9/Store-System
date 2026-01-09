const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || 'Something went wrong try again later',
    path: err.path,
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }

  if (err.name === 'CastError') {
    customError.msg = 'Something went wrong try again later';
    customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg = Object.values(err.errors).map(item => item.message).join(', ');
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.msg =  `Duplicate values for ${Object.keys(err.keyValue)} field, please choose another value`;
    // customError.path = 'barcode';
  }
  // return res.status(customError.statusCode).json({err});
  console.log({err});
  return res.status(customError.statusCode).json({ msg: customError.msg, path: customError.path });
}

module.exports = errorHandlerMiddleware;