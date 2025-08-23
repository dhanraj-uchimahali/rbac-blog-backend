export const responseMiddleware = (req, res, next) => {
  // Success response handler
  res.success = (data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message: message,
      result: data,
    });
  };

  // Error response handler
  res.error = (message = 'Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message: message
    });
  };

  next();
};
