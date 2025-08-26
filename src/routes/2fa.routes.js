import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { twoFactorAuthMiddleware } from "../middleware/2fa.middleware.js";
import { rbacMiddleware } from "../middleware/rbac.middleware.js";
import twoFactorAuthenticationController from "../controllers/2fa.controller.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

// route_name : /2fa/setup
// route_description : Endpoint to enable 2FA 
router.get(
  "/setup",
  twoFactorAuthMiddleware,
  rbacMiddleware([PERMISSIONS.ENABLE_2FA]),
  twoFactorAuthenticationController.setup
);

// route_name : /2fa/verify
// route_description : Endpoint to verify 2FA OTP
router.post(
  "/verify",
  twoFactorAuthMiddleware,
  rbacMiddleware([PERMISSIONS.VERIFY_2FA]),
  twoFactorAuthenticationController.verify
);

// route_name : /2fa/disable
// route_description : Endpoint to disable 2FA
router.post(
  "/disable",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.DISABLE_ANY_2FA, PERMISSIONS.DISABLE_2FA]),
  twoFactorAuthenticationController.disable
);

export default router;
