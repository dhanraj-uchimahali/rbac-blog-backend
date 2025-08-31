import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import dayjs from "dayjs";
import crypto from "crypto";
import db from "../models/mysql/index.js";
import { ROLES } from "../constants/roles.js";
import { generateRefreshToken, generateToken } from "../utils/auth.js";
import CustomError from "../utils/customError.js";
import logger from '../utils/logger.js';

const twoFactorAuthenticationService = {};

twoFactorAuthenticationService.setup = async ({ userId }) => {
  logger.success.info({
    stage: "2FA_SETUP",
    msg: "2FA setup process initiated",
    userId,
  });

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true
  });

  if (!userData) {
    logger.error.error({
      stage: "2FA_SETUP",
      msg: "2FA setup process failed - User not found",
      userId,
    });
    throw new CustomError(404, "User not found");
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

  logger.success.info({
    stage: "2FA_SETUP",
    msg: "2FA enabled successfully",
    userId,
  });
  return qrCodeImage;
};

twoFactorAuthenticationService.verify = async ({ otp, userId }) => {
  logger.success.info({
    stage: "2FA_VERIFY",
    msg: "2FA verification process initiated",
    userId,
    otp
  });

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    logger.error.error({
      stage: "2FA_VERIFY",
      msg: "2FA verification process failed - User not found",
      userId,
      otp
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
      stage: "2FA_VERIFY",
      msg: "2FA verification process failed - Role not found",
      userId,
      otp
    });
    throw new CustomError(404, "Role not found");
  }

  const isTOTPVerified = speakeasy.totp.verify({
    secret: userData.user_secret,
    encoding: "base32",
    token: otp,
  });

  if (!isTOTPVerified) {
    logger.error.error({
      stage: "2FA_VERIFY",
      msg: "2FA verification process failed - Invalid or expired 2FA code",
      userId,
      otp
    });
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

  logger.success.info({
    stage: "2FA_VERIFY",
    msg: "2FA OTP verified successfully",
    userId,
    otp
  });

  return {
    userId: userData.user_id,
    roleType: roleData.name,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

twoFactorAuthenticationService.disable = async ({ userId, roleType, otp }) => {
  logger.success.info({
    stage: "2FA_DISABLE",
    msg: "2FA disable process initiated",
    userId,
    roleType,
    otp
  });

  /* Check whether user details exists or not */
  const userData = await db.User.findOne({
    where: { user_id: userId, is_active: 1 },
    raw: true,
  });

  if (!userData) {
    logger.error.error({
      stage: "2FA_DISABLE",
      msg: "2FA disable process failed - User not found",
      userId,
      roleType,
      otp,
    });
    throw new CustomError(404, "User not found");
  }

  if (roleType !== ROLES.USER_ADMIN && userId !== userData.user_id) {
    logger.error.error({
      stage: "2FA_DISABLE",
      msg: "2FA disable process failed - Forbidden: Access Denied",
      userId,
      roleType,
      otp,
    });
    throw new CustomError(403, "Forbidden: Access Denied");
  }

  if (roleType !== ROLES.USER_ADMIN) {
    const isTOTPVerified = speakeasy.totp.verify({
      secret: userData.user_secret,
      encoding: "base32",
      token: otp,
    });
    if (!isTOTPVerified) {
      logger.error.error({
        stage: "2FA_DISABLE",
        msg: "2FA disable process failed - Invalid or expired 2FA code",
        userId,
        roleType,
        otp,
      });
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

  logger.success.info({
    stage: "2FA_DISABLE",
    msg: "2FA disabled successfully",
    userId,
    roleType,
    otp,
  });
};

export default twoFactorAuthenticationService;
