/**
 * Custom async handler to wrap async route functions
 * so errors are automatically passed to Express error middleware.
 */
export const asyncHandler = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
