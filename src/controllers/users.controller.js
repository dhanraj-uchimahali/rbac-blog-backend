import { asyncHandler } from "../utils/asyncHandler.js";
import userService from "../services/users.service.js";
const userController = {};

userController.create = asyncHandler(async (req, res) => {
  const result = await userService.create({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    roleType: req.body.roleType
  });
  res.success(result, "User created successfully.", 201);
});

userController.fetchAll = asyncHandler(async (req, res) => {
  const result = await userService.fetchAll({ search: req.query.search, limit: req.query.limit, offset: req.offset });
  res.success(result, "Users data fetched successfully.", 200);
});

userController.fetchOne = asyncHandler(async (req, res) => {
  const result = await userService.fetchOne({ userId: req.params.userId, roleType: req.roleType, user_id: req.userId });
  res.success(result, "User data fetched successfully.", 200);
});

userController.update = asyncHandler(async (req, res) => {
  const result = await userService.update({
    userId: req.params.userId,
    fullName: req.body.fullName,
    email: req.body.email,
    roleType: req.roleType, 
    user_id: req.userId
  });
  res.success(result, "User updated successfully.", 200);
});

userController.delete = asyncHandler(async (req, res) => {
  const result = await userService.delete({ userId: req.params.userId, roleType: req.roleType, user_id: req.userId });
  res.success(result, "User deleted successfully.", 200);
});

userController.login = asyncHandler(async (req, res) => {
  const result = await userService.login({
    email: req.body.email,
    password: req.body.password,
  });
  res.success(result, "User logged in successfully.", 200);
});

userController.logout = asyncHandler(async (req, res) => {
  const result = await userService.logout({
    userId: req.userId,
    token: req.headers.Authorization || req.headers.authorization
  });
  res.success(result, "User logged out successfully.", 200);
});


userController.refreshToken = asyncHandler(async (req, res) => {
  const result = await userService.refreshToken({
    userId: req.userId,
    roleType: req.roleType
  });
  res.success(result, "Refresh token generated successfully.", 200);
});


export default userController;
