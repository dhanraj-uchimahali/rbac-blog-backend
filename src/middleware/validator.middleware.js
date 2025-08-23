export const validatorMiddleware = ({ body: bodySchema, params: paramsSchema, query: querySchema, file: fileSchema, files: filesSchema }) => {
  return async (req, res, next) => {
    try {
      if (bodySchema) {
        const validatedBody = await bodySchema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
        req.body = validatedBody;
      }

      if (paramsSchema) {
        const validatedParams = await paramsSchema.validate(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });
        req.params = validatedParams;
      }

      if (querySchema) {
        const validatedQuery = await querySchema.validate(req.query, {
          abortEarly: false,
          stripUnknown: true,
        });
        req.query = validatedQuery;
      }
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };
};
