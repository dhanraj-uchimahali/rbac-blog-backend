import CustomError from "../utils/customError.js";
import { generateRefreshToken, generateToken, verifyToken, generateTempToken } from "../utils/auth.js";
import db from "../models/mysql/index.js";
import { client } from "../db/redis.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import crypto from "crypto";
import { Op } from "sequelize";
import { ROLES } from "../constants/roles.js";
import logger from "../utils/logger.js";

const userService = {};

userService.create = async ({ fullName, email, password, confirmPassword, roleType }) => {
  logger.success.info({
    stage: "CREATE_USER",
    msg: "User creation started",
    fullName,
    email,
    roleType,
  });

  /* If password and confirm password does not match throw an error */
  if (password !== confirmPassword) {
    logger.error.error({
      stage: "CREATE_USER",
      msg: "User creation failed - Password does not match",
      fullName,
      email,
      roleType,
    });
    throw new CustomError(400, "Password does not match");
  }

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { name: roleType, is_active: 1 },
    raw: true,
  });

  if (!roleData) {
    logger.error.error({
      stage: "CREATE_USER",
      msg: "User creation failed - Role not found",
      fullName,
      email,
      roleType,
    });
    throw new CustomError(404, "Role not found");
  }

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { email: email, is_active: 1 },
  });

  if (userData) {
    logger.error.error({
      stage: "CREATE_USER",
      msg: "User creation failed - User already exists",
      fullName,
      email,
      roleType,
    });
    throw new CustomError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  /* Insert data in users table */
  await db.User.create({
    full_name: fullName,
    email: email,
    password: hashedPassword,
    role_id: roleData.role_id,
  });

  logger.success.info({
    stage: "CREATE_USER",
    msg: "User created successfully",
    fullName,
    email,
    roleType,
  });
};

userService.fetchAll = async () => {
  logger.success.info({
    stage: "FETCH_USERS",
    msg: "Users data fetch started",
  });

  /* Check whether user details exists or not */
  const userDetails = await db.User.findAll({
    include: { model: db.Roles, as: "role", attributes: ["name"]},
    where: { is_active: 1 },
    attributes: ["user_id", "full_name", "email", "role_id"],
    raw: true,
  });

  const response = userDetails.map((user) => ({
    userId: user["user_id"],
    name: user["full_name"],
    email: user["email"],
    roleId: user["role_id"],
    roleType: user["role.name"],
  }));

  logger.success.info({
    stage: "FETCH_USERS",
    msg: "Users data fetched successfully",
  });

  return response;
};

userService.fetchOne = async ({ userId, roleType, user_id }) => {
  logger.success.info({
    stage: "FETCH_USER",
    msg: "User data fetch initiated",
    userId,
    roleType,
  });

  /* Allow access if the user is an admin, or if not admin, only allow access to their own data */
  if (roleType !== ROLES.USER_ADMIN && parseInt(userId) !== user_id) {
    logger.error.error({
      stage: "FETCH_USER",
      msg: "User data fetch failed - Forbidden: Access Denied",
      userId,
      roleType,
    });

    throw new CustomError(403, "Forbidden: Access Denied");
  }

  /* Check whether user details exists or not */
  const userDetail = await db.User.findOne({
    include: { model: db.Roles, as: "role", attributes: ["name"] },
    where: { user_id: userId, is_active: 1 },
    attributes: ["user_id", "full_name", "email", "role_id"],
    raw: true,
  });

  if (!userDetail) {
    logger.error.error({
      stage: "FETCH_USER",
      msg: "User data fetch failed - User not found",
      userId,
      roleType,
    });
    throw new CustomError(404, "User not found");
  }

  const response = {
    userId: userDetail["user_id"],
    name: userDetail["full_name"],
    email: userDetail["email"],
    roleId: userDetail["role_id"],
    roleType: userDetail["role.name"],
  };

  logger.success.info({
    stage: "FETCH_USER",
    msg: "User data fetched successfully.",
    userId,
    roleType,
  });

  return response;
};

userService.update = async ({ userId, fullName, email, roleType, user_id }) => {
  logger.success.info({
    stage: "UPDATE_USER",
    msg: "User update process started",
    userId,
    fullName,
    email,
    roleType,
  });

  /* Allow access if the user is an admin, or if not admin, only allow access to their own data */
  if (roleType !== ROLES.USER_ADMIN && parseInt(userId) !== user_id) {
    logger.error.error({
      stage: "UPDATE_USER",
      msg: "User update process failed - Forbidden: Access denied",
      userId,
      fullName,
      email,
      roleType,
    });

    throw new CustomError(403, "Forbidden: Access denied");
  }

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
  });

  if (!userData) {
    logger.error.error({
      stage: "UPDATE_USER",
      msg: "User update process failed - User not found",
      userId,
      fullName,
      email,
      roleType,
    });

    throw new CustomError(404, "User not found");
  }

  /* Update data in users table */
  await db.User.update(
    {
      full_name: fullName,
      email: email,
    },
    {
      where: { user_id: userId },
    }
  );

  logger.success.info({
    stage: "UPDATE_USER",
    msg: "User updated successfully",
    userId,
    fullName,
    email,
    roleType,
  });
};

userService.delete = async ({ userId, roleType, user_id }) => {
  logger.success.info({
    stage: "DELETE_USER",
    msg: "User delete process started",
    userId,
    roleType,
  });

  /* Allow access if the user is an admin, or if not admin, only allow access to their own data */
  if (roleType !== ROLES.USER_ADMIN && parseInt(userId) !== user_id) {
    logger.error.error({
      stage: "DELETE_USER",
      msg: "User delete process failed - Forbidden: Access denied",
      userId,
      roleType,
    });

    throw new CustomError(403, "Forbidden: Access Denied");
  }

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
  });

  if (!userData) {
    logger.error.error({
      stage: "DELETE_USER",
      msg: "User delete process failed - User not found",
      userId,
      roleType,
    });

    throw new CustomError(404, "User not found");
  }

  /* Update data in users table */
  await db.User.update({ is_active: 0 }, { where: { user_id: userId } });

  logger.success.info({
    stage: "DELETE_USER",
    msg: "User deleted successfully",
    userId,
    roleType,
  });
};

userService.login = async ({ email, password }) => {
  logger.success.info({
    stage: "LOGIN",
    msg: "Login process started",
    email,
    password,
  });

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { email: email, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    logger.error.error({
      stage: "LOGIN",
      msg: "Login process failed - User not found",
      email,
      password,
    });

    throw new CustomError(404, "User not found");
  }

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { role_id: userData.role_id, is_active: 1 },
    raw: true,
  });

  if (!roleData) {
    logger.error.error({
      stage: "LOGIN",
      msg: "Login process failed - Role not found",
      email,
      password,
    });

    throw new CustomError(404, "Role not found");
  }

  const comparePassword = await bcrypt.compare(password, userData.password);

  if (!comparePassword) {
    logger.error.error({
      stage: "LOGIN",
      msg: "Login process failed - Password does not match",
      email,
      password,
    });
    
    throw new CustomError(400, "Password does not match");
  }

  const is2FAEnabled = userData.is_2fa_enabled ? true : false;

  if (is2FAEnabled) {
    /* Generate access token */
    const tempAccessToken = await generateTempToken({
      payload: {
        userId: userData.user_id,
        roleType: roleData.name,
        jti: crypto.randomBytes(10).toString("hex"),
      },
    });

    logger.success.info({
      stage: "LOGIN",
      msg: "User logged in successfully",
      email,
      password,
    });

    return {
      userId: userData.user_id,
      roleType: roleData.name,
      is2FAEnabled: is2FAEnabled,
      accessToken: tempAccessToken
    };
  }

  /* Generate access token */
  const accessToken = await generateToken({
    payload: {
      userId: userData.user_id,
      roleType: roleData.name,
      jti: crypto.randomBytes(10).toString("hex"),
    },
  });

  /* Generate refresh token */
  const refreshToken = await generateRefreshToken({
    payload: {
      userId: userData.user_id,
      roleType: roleData.name,
      jti: crypto.randomBytes(10).toString("hex"),
    },
  });

  /* Add auth token, refresh token and its expiry date in users table */
  await db.User.update(
    {
      auth_token: accessToken,
      refresh_token: refreshToken,
      refresh_token_expires_at: dayjs().add(2, "day").format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      where: { user_id: userData.user_id },
    }
  );

  logger.success.info({
    stage: "LOGIN",
    msg: "User logged in successfully",
    email,
    password,
  });

  return {
    userId: userData.user_id,
    roleType: roleData.name,
    is2FAEnabled: is2FAEnabled,
    accessToken: accessToken
  };
};

userService.logout = async ({ userId, token }) => {
  logger.success.info({
    stage: "LOGOUT",
    msg: "Logout process started",
    userId,
  });

  const decodedToken = await verifyToken(token.split(" ")[1]);
  const exp = decodedToken.exp;
  const jwtId = decodedToken.payload.jti;
  let ttl = exp - Math.floor(Date.now() / 1000);

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: {
      user_id: userId,
      is_active: 1,
      auth_token: { [Op.ne]: null },
      refresh_token: { [Op.ne]: null },
    },
    raw: true,
  });

  if (!userData) {
    logger.error.error({
      stage: "LOGOUT",
      msg: "Logout process failed - User not found",
      userId,
    });
    
    throw new CustomError(404, "User not found");
  }

  /* Remove auth token, in users table */
  await db.User.update(
    { auth_token: null, refresh_token: null },
    { where: { user_id: userId } }
  );

  /* Blacklist this token by saving jwt id in Redis until it expires */
  await client.set(jwtId, userId, {
    EX: ttl
  });

  logger.success.info({
    stage: "LOGOUT",
    msg: "User logged out successfully",
    userId,
  });
};

userService.refreshToken = async ({ userId, roleType }) => {
  logger.success.info({
    stage: "REFRESH_TOKEN",
    msg: "Refresh token initiated",
    userId,
    roleType,
  });
  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    logger.error.error({
      stage: "REFRESH_TOKEN",
      msg: "Refresh token failed - User not found",
      userId,
      roleType,
    });

    throw new CustomError(404, "User not found");
  }

  const token = await generateToken({
    payload: {
      userId: userId,
      roleId: roleType,
      jti: crypto.randomBytes(10).toString("hex"),
    },
  });

  const refreshToken = await generateRefreshToken({
    payload: {
      userId: userData.user_id,
      roleType: roleData.name,
      jti: crypto.randomBytes(10).toString("hex"),
    },
  });

  /* Update auth token users table */
  await db.User.update(
    {
      auth_token: token,
      refresh_token: refreshToken,
      refresh_token_expires_at: dayjs().add(2, "day").format("YYYY-MM-DD HH:mm:ss"),
    },
    { where: { user_id: userId } }
  );

  logger.success.info({
    stage: "REFRESH_TOKEN",
    msg: "Refresh token generated successfully",
    userId,
    roleType,
  });
  
  return { accessToken: token };
};

export default userService;
