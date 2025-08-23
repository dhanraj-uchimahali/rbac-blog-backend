import express from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import permissionsController from "../controllers/permissions.controller.js";
import { validatorMiddleware } from "../middleware/validator.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { rbacMiddleware } from "../middleware/rbac.middleware.js";
import {createPermissionSchema, fetchPermissionParamsSchema, updatePermissionSchema, updatePermissionParamsSchema, deletePermissionSchema } from "../schema/permissions.schema.js";

const router = express.Router();

// route_name : /permissions
// route_description : Endpoint to retrieve all active permissions
router.get(
  "/",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.VIEW_ALL_PERMISSIONS),
  permissionsController.fetchAll
);

// route_name : /permissions/:permissionId
// route_description : Endpoint to retrieve permission data on the basis of permissionId
router.get(
  "/:permissionId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.VIEW_PERMISSION),
  validatorMiddleware({ params: fetchPermissionParamsSchema }),
  permissionsController.fetchOne
);

// route_name : /permissions
// route_description : Endpoint to create a new permission
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.CREATE_PERMISSION),
  validatorMiddleware({ body: createPermissionSchema }),
  permissionsController.create
);

// route_name : /permissions/:permissionId
// route_description : Endpoint to update an existing permission by ID
router.put(
  "/:permissionId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.UPDATE_PERMISSION),
  validatorMiddleware({
    body: updatePermissionSchema,
    params: updatePermissionParamsSchema,
  }),
  permissionsController.update
);

// route_name : /permissions/:permissionId
// route_description : Endpoint to delete an existing permission by ID
router.delete(
  "/:permissionId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.DELETE_PERMISSION),
  validatorMiddleware({ params: deletePermissionSchema }),
  permissionsController.delete
);

export default router;
