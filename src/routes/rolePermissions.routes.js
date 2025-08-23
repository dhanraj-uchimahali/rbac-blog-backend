import express from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import rolePermissionsController from "../controllers/rolePermissions.controller.js";
import { validatorMiddleware } from "../middleware/validator.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { rbacMiddleware } from "../middleware/rbac.middleware.js";
import { createRolePermissionsSchema, fetchRolePermissionSchema, updateRolePermissionsSchema, updateRolePermissionsParamsSchema, deleteRolePermissionsSchema } from "../schema/rolePermissions.schema.js";

const router = express.Router();

// route_name : /role-permissions
// route_description : Endpoint to retrieve all active role permissions data
router.get(
  "/",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.VIEW_ALL_ROLE_PERMISSIONS),
  rolePermissionsController.fetchAll
);

// route_name : /role-permissions/:rolePermissionId
// route_description : Endpoint to retrieve role permission data on the basis of rolePermissionId
router.get(
  "/:rolePermissionId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.VIEW_ROLE_PERMISSION),
  validatorMiddleware(fetchRolePermissionSchema),
  rolePermissionsController.fetchOne
);

// route_name : /role-permissions
// route_description : Endpoint to create a new role permission
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.CREATE_ROLE_PERMISSION),
  validatorMiddleware({ body: createRolePermissionsSchema }),
  rolePermissionsController.create
);

// route_name : /role-permissions/:rolePermissionId
// route_description : Endpoint to update an existing role permission by ID
router.put(
  "/:rolePermissionId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.UPDATE_ROLE_PERMISSION),
  validatorMiddleware({
    body: updateRolePermissionsSchema,
    params: updateRolePermissionsParamsSchema,
  }),
  rolePermissionsController.update
);

// route_name : /role-permissions/:rolePermissionId
// route_description : Endpoint to delete an existing role permission by ID
router.delete(
  "/:rolePermissionId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.DELETE_ROLE_PERMISSION),
  validatorMiddleware({ params: deleteRolePermissionsSchema }),
  rolePermissionsController.delete
);

export default router;
