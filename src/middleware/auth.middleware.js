import CustomError from "../utils/customError.js";
import { verifyToken } from "../utils/auth.js";
import { client } from "../db/redis.js";
import config from "../constants/config.js";
export const authMiddleware = async (request, response, next) => {
  try {
    let token;
    let authHeaders = request.headers.Authorization || request.headers.authorization;
    if (!authHeaders) {
      throw new CustomError(400, "Token is missing.");
    }
    if (authHeaders.startsWith("Bearer")) {
      token = authHeaders.split(" ")[1];
    }
    const decodedToken = await verifyToken(token);
    
    /* Check from redis whether the token is blacklisted or not */
    if (config.redis.enabled) {
      const isBlacklisted = await client.exists(decodedToken.payload.jti);
      if (isBlacklisted) {
        return next(new CustomError(401, "Token has been blacklisted"));
      }
    }
    
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
    next(error)
  }
};
