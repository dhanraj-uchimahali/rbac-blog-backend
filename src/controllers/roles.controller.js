import { asyncHandler } from "../utils/asyncHandler.js";
import rolesService from "../services/roles.service.js";
const rolesController = {};

rolesController.fetchAll = asyncHandler(async (req, res) => {
  const result = await rolesService.fetchAll({ search: req.query.search, limit: req.query.limit, offset: req.limit.offset });
  res.success(result, "Roles fetched successfully.", 200);
});

rolesController.fetchOne = asyncHandler(async (req, res) => {
  const result = await rolesService.fetchOne({ roleId: req.params.roleId });
  res.success(result, "Role fetched successfully.", 200);
});

rolesController.create = asyncHandler(async (req, res) => {
  const result = await rolesService.create({
    name: req.body.name
  });
  res.success(result, "Role created successfully.", 201);
});

rolesController.update = asyncHandler(async (req, res) => {
  const result = await rolesService.update({
    roleId: req.params.roleId,
    name: req.body.name,
  });
  res.success(result, "Role updated successfully.", 200);
});

rolesController.delete = asyncHandler(async (req, res) => {
  const result = await rolesService.delete({ roleId: req.params.roleId });
  res.success(result, "Role deleted successfully.", 200);
});

export default rolesController;
