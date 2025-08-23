export const errorMiddleware =(err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.statusCode >= 400 && err.statusCode <= 499) {
    return res.error(err.message, err.statusCode, {
      error: err,
      stack: err.stack,
    });
  }

  if (err.statusCode === 500) {
    console.log(err);
    // Programming or unknown errors
    return res.error("Something went wrong", 500);
  }
};
