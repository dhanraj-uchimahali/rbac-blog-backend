import { asyncHandler } from "../utils/asyncHandler.js";
import rolePermissionsService from "../services/rolePermissions.service.js";
const rolePermissionsController = {};

rolePermissionsController.create = asyncHandler(async (req, res) => {
  const result = await rolePermissionsService.create({
    roleType: req.body.roleType,
    permissionDescription: req.body.permissionDescription
  });
  res.success(result, "Role permission created successfully.", 201);
});

rolePermissionsController.fetchAll = asyncHandler(async (req, res) => {
  const result = await rolePermissionsService.fetchAll({});
  res.success(result, "Role permissions fetched successfully.", 200);
});

rolePermissionsController.fetchOne = asyncHandler(async (req, res) => {
  const result = await rolePermissionsService.fetchOne({ rolePermissionId: req.params.rolePermissionId });
  res.success(result, "Role permissions fetched successfully.", 200);
});

rolePermissionsController.update = asyncHandler(async (req, res) => {
  const result = await rolePermissionsService.update({
    rolePermissionId: req.params.rolePermissionId,
    roleType: req.body.roleType,
    permissionDescription: req.body.permissionDescription
  });
  res.success(result, "Role permission updated successfully.", 200);
});

rolePermissionsController.delete = asyncHandler(async (req, res) => {
  const result = await rolePermissionsService.delete({ rolePermissionId: req.params.rolePermissionId });
  res.success(result, "Role permission deleted successfully.", 200);
});

export default rolePermissionsController;
