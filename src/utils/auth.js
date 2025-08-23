import jwt from "jsonwebtoken";
import { config } from "../constants/config.js";

export const generateToken = async (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

export const generateRefreshToken = async (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn
  });
};

export const verifyToken = async (token) => {
 return jwt.verify(token, config.jwt.secret)
}
