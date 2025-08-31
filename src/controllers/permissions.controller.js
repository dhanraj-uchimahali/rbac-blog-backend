import { asyncHandler } from "../utils/asyncHandler.js";
import permissionsService from "../services/permissions.service.js";
const permissionsController = {};

permissionsController.create = asyncHandler(async (req, res) => {
  const result = await permissionsService.create({
    name: req.body.name,
    description: req.body.description
  });
  res.success(result, "Permission created successfully.", 201);
});

permissionsController.fetchAll = asyncHandler(async (req, res) => {
  const result = await permissionsService.fetchAll({ search: req.query.search, limit: req.query.limit, offset: req.query.offset });
  res.success(result, "Permissions fetched successfully.", 200);
});

permissionsController.fetchOne = asyncHandler(async (req, res) => {
  const result = await permissionsService.fetchOne({ permissionId: req.params.permissionId });
  res.success(result, "Permission fetched successfully.", 200);
});

permissionsController.update = asyncHandler(async (req, res) => {
  const result = await permissionsService.update({
    permissionId: req.params.permissionId,
    name: req.body.name,
    description: req.body.description
  });
  res.success(result, "Permission updated successfully.", 200);
});

permissionsController.delete = asyncHandler(async (req, res) => {
  const result = await permissionsService.delete({ permissionId: req.params.permissionId, });
  res.success(result, "Permission deleted successfully.", 200);
});

export default permissionsController;
