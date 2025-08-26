import CustomError from "../utils/customError.js";
import { verifyTempToken } from "../utils/auth.js";
export const twoFactorAuthMiddleware = async (request, response, next) => {
  try {
    let token;
    let authHeaders = request.headers.Authorization || request.headers.authorization;
    if (!authHeaders) {
      throw new CustomError(400, "Token is missing.");
    }
    if (authHeaders.startsWith("Bearer")) {
      token = authHeaders.split(" ")[1];
    }
    const decodedToken = await verifyTempToken(token);
    request.userId = decodedToken.payload.userId;
    request.roleType = decodedToken.payload.roleType;
    next();
  } catch (error) {
    if (error.message === "invalid signature") {
      return next(new CustomError(400, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new CustomError(400, "Token expired"));
    }
    next(error);
  }
};
