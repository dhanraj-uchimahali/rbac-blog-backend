import { asyncHandler } from "../utils/asyncHandler.js";
import twoFactorAuthenticationService from "../services/2fa.service.js";

const twoFactorAuthenticationController = {};

twoFactorAuthenticationController.setup = asyncHandler(async (req, res) => {
  const result = await twoFactorAuthenticationService.setup({
    userId: req.userId
  });
  res.success(result, "2FA enabled successfully.", 200);
});

twoFactorAuthenticationController.verify = asyncHandler(async (req, res) => {
  const result = await twoFactorAuthenticationService.verify({ otp: req.body.otp, userId: req.userId });
  res.success(result, "2FA OTP verified successfully.", 200);
});


twoFactorAuthenticationController.disable = asyncHandler(async (req, res) => {
  const result = await twoFactorAuthenticationService.disable({ userId: req.userId, roleType: req.roleType,otp: req.body.otp });
  res.success(result, "2FA disabled successfully.", 200);
});

export default twoFactorAuthenticationController;
