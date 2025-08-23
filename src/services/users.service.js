import CustomError from "../utils/customError.js";
import { generateRefreshToken, generateToken, verifyToken } from "../utils/auth.js";
import db from "../models/mysql/index.js";
import { client } from "../db/redis.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import crypto from "crypto";
import { Op } from "sequelize";
import { ROLES } from "../constants/roles.js";

const userService = {};

userService.create = async ({ fullName, email, password, confirmPassword, roleType }) => {
  /* If password and confirm password does not match throw an error */
  if (password !== confirmPassword) {
    throw new CustomError(400, "Password does not match");
  }

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { name: roleType, is_active: 1 },
    raw: true,
  });

  if (!roleData) {
    throw new CustomError(400, "Role data not found");
  }

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { email: email, is_active: 1 },
  });

  if (userData) {
    throw new CustomError(400, "User data already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  /* Insert data in users table */
  await db.User.create({
    full_name: fullName,
    email: email,
    password: hashedPassword,
    role_id: roleData.role_id,
  });
};

userService.fetchAll = async ({}) => {
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
    roleId: user["role_id"],
    roleType: user["role.name"],
  }));

  return response;
};

userService.fetchOne = async ({ userId, roleType, user_id }) => {
  /* Allow access if the user is an admin, or if not admin, only allow access to their own data */
  if (roleType !== ROLES.USER_ADMIN && parseInt(userId) !== user_id) {
    throw new CustomError(403, "Forbidden: You cannot access this data");
  }
  /* Check whether user details exists or not */
  const userDetail = await db.User.findOne({
    include: { model: db.Roles, as: "role", attributes: ["name"] },
    where: { user_id: userId, is_active: 1 },
    attributes: ["user_id", "full_name", "email", "role_id"],
    raw: true,
  });

  if (!userDetail) {
    throw new CustomError(400, "User data not found");
  }
  const response = {
    userId: userDetail["user_id"],
    name: userDetail["full_name"],
    roleId: userDetail["role_id"],
    roleType: userDetail["role.name"],
  };
  return response;
};

userService.update = async ({ userId, fullName, email, roleType, user_id }) => {
  /* Allow access if the user is an admin, or if not admin, only allow access to their own data */
  if (roleType !== ROLES.USER_ADMIN && parseInt(userId) !== user_id) {
    throw new CustomError(403, "Forbidden: You cannot update other users data");
  }

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
  });

  if (!userData) {
    throw new CustomError(400, "User data not found");
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
};

userService.delete = async ({ userId, roleType, user_id }) => {
  /* Allow access if the user is an admin, or if not admin, only allow access to their own data */
  if (roleType !== ROLES.USER_ADMIN && parseInt(userId) !== user_id) {
    throw new CustomError(403, "Forbidden: You cannot delete other users data");
  }

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
  });

  if (!userData) {
    throw new CustomError(400, "User data not found");
  }

  /* Update data in users table */
  await db.User.update({ is_active: 0 }, { where: { user_id: userId } });
};

userService.login = async ({ email, password }) => {
  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { email: email, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    throw new CustomError(400, "User data not found");
  }

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { role_id: userData.role_id, is_active: 1 },
    raw: true,
  });

  if (!roleData) {
    throw new CustomError(400, "Role data not found");
  }

  const comparePassword = await bcrypt.compare(password, userData.password);

  if (!comparePassword) {
    throw new CustomError(400, "Password does not match");
  }

  /* Generate access token */
  const accessToken = await generateToken({
    payload: { userId: userData.user_id, roleType: roleData.name, jti: crypto.randomBytes(10).toString("hex") },
  });

  /* Generate refresh token */
  const refreshToken = await generateRefreshToken({
    payload: { userId: userData.user_id, roleType: roleData.name, jti: crypto.randomBytes(10).toString("hex") },
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

  return {
    userId: userData.user_id,
    roleType: roleData.name,
    accessToken: accessToken,
    refreshToken: refreshToken
  };
};

userService.logout = async ({ userId, token }) => {
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
    throw new CustomError(400, "User data not found");
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

};

userService.refreshToken = async ({ userId, roleType }) => {
  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    throw new CustomError(400, "User data not found");
  }
  const token = await generateToken({
    payload: { userId: userId, roleId: roleType },
  });

  /* Update auth token, refresh token and its expiry date in users table */
  await db.User.update({ auth_token: token }, { where: { user_id: userId } });

  return { accessToken: token };
};

export default userService;
