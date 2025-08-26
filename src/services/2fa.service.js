import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import dayjs from "dayjs";
import crypto from "crypto";
import db from "../models/mysql/index.js";
import { ROLES } from "../constants/roles.js";
import { generateRefreshToken, generateToken } from "../utils/auth.js";
import CustomError from "../utils/customError.js";

const twoFactorAuthenticationService = {};

twoFactorAuthenticationService.setup = async ({ userId }) => {
  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true
  });

  if (!userData) {
    throw new CustomError(404, "User data not found");
  }

  const secret = speakeasy.generateSecret();

  const qrCodeURL = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `${userData.email}`,
    issuer: "My Blog",
    encoding: 'base32'
  })
  
  const qrCodeImage = qrcode.toDataURL(qrCodeURL);

  await db.User.update(
    {
      user_secret: secret.base32,
      is_2fa_enabled: 1
    },
    { where: { user_id: userId } }
  );

  return qrCodeImage;
};

twoFactorAuthenticationService.verify = async ({ otp, userId }) => {
  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    throw new CustomError(404, "User data not found");
  }

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { role_id: userData.role_id, is_active: 1 },
    raw: true,
  });

  if (!roleData) {
    throw new CustomError(404, "Role data not found");
  }

  const isTOTPVerified = speakeasy.totp.verify({
    secret: userData.user_secret,
    encoding: "base32",
    token: otp,
  });

  if (!isTOTPVerified) {
    throw new CustomError(400, "Invalid or expired 2FA code");
  }

  const accessToken = await generateToken({
    payload: {
      userId: userData.user_id,
      roleType: roleData.name,
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
    refreshToken: refreshToken,
  };
};

twoFactorAuthenticationService.disable = async ({ userId, roleType, otp }) => {
  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    throw new CustomError(404, "User data not found");
  }

  if (roleType !== ROLES.USER_ADMIN && userId !== userData.user_id) {
    throw new CustomError(403, "Forbidden: You can only disable your own 2FA");
  }

  if (roleType !== ROLES.USER_ADMIN) {
    const isTOTPVerified = speakeasy.totp.verify({
      secret: userData.user_secret,
      encoding: "base32",
      token: otp,
    });
    if (!isTOTPVerified) {
      throw new CustomError(400, "Invalid or expired 2FA code");
    }
  }

  await db.User.update(
    {
      user_secret: null,
      is_2fa_enabled: 0,
    },
    { where: { user_id: userId } }
  );
};

export default twoFactorAuthenticationService;
