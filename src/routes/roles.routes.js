import express from "express";
import { PERMISSIONS } from "../constants/permissions.js";
import rolesController from "../controllers/roles.controller.js";
import { validatorMiddleware } from "../middleware/validator.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { rbacMiddleware } from "../middleware/rbac.middleware.js";
import { createRoleSchema, fetchRoleParamsSchema, updateRoleSchema, updateRoleParamsSchema, deleteRoleSchema } from "../schema/roles.schema.js";
const router = express.Router();

// route_name : /roles
// route_description : Endpoint to retrieve all roles data
router.get(
  "/",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.VIEW_ALL_ROLES),
  rolesController.fetchAll
);

// route_name : /roles/:roleId
// route_description : Endpoint to retrieve role data on the basis of roleId
router.get(
  "/:roleId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.VIEW_ROLE),
  validatorMiddleware({ params: fetchRoleParamsSchema }),
  rolesController.fetchOne
);

// route_name : /roles
// route_description : Endpoint to create a new role
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.CREATE_ROLE),
  validatorMiddleware({ body: createRoleSchema }),
  rolesController.create
);

// route_name : /roles/:roleId
// route_description : Endpoint to update an existing role by ID
router.put(
  "/:roleId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.UPDATE_ROLE),
  validatorMiddleware({
    body: updateRoleSchema,
    params: updateRoleParamsSchema,
  }),
  rolesController.update
);

// route_name : /roles/:roleId
// route_description : Endpoint to delete an existing role by ID
router.delete(
  "/:roleId",
  authMiddleware,
  rbacMiddleware(PERMISSIONS.DELETE_ROLE),
  validatorMiddleware({ params: deleteRoleSchema }),
  rolesController.delete
);

export default router;
