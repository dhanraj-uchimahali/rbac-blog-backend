import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validatorMiddleware } from "../middleware/validator.middleware.js";
import { rbacMiddleware } from "../middleware/rbac.middleware.js";
import userController from "../controllers/users.controller.js";
import { PERMISSIONS } from "../constants/permissions.js";
import { createUserSchema, fetchUserParamsSchema, updateUserSchema, updateUserParamsSchema, deleteUserSchema, userLoginSchema } from "../schema/users.schema.js";

const router = express.Router();

// route_name : /users
// route_description : Endpoint to retrieve all users data
router.get(
  "/",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.VIEW_ALL_USERS]),
  userController.fetchAll
);

// route_name : /users/:userId
// route_description : Endpoint to retrieve user data
router.get(
  "/:userId",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.VIEW_USER]),
  validatorMiddleware({ params: fetchUserParamsSchema }),
  userController.fetchOne
);

// route_name : /users
// route_description : Endpoint to create a new user
router.post(
  "/",
  validatorMiddleware({ body: createUserSchema }),
  userController.create
);

// route_name : /users/:userId
// route_description : Endpoint to update an existing user by userId
router.put(
  "/:userId",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.UPDATE_ANY_USER, PERMISSIONS.UPDATE_USER]),
  validatorMiddleware({
    body: updateUserSchema,
    params: updateUserParamsSchema,
  }),
  userController.update
);

// route_name : /users/:userId
// route_description : Endpoint to delete an existing user by userId
router.delete(
  "/:userId",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.DELETE_ANY_USER, PERMISSIONS.DELETE_USER]),
  validatorMiddleware({ params: deleteUserSchema }),
  userController.delete
);

// route_name : /users/login
// route_description : Endpoint for user login
router.post(
  "/login",
  validatorMiddleware({ body: userLoginSchema }),
  userController.login
);

// route_name : /users/refresh-token
// route_description : Endpoint for user login
router.post("/refresh-token", authMiddleware, userController.refreshToken);

// route_name : /users/logout
// route_description : Endpoint for user logout
router.post("/logout", authMiddleware, userController.logout);

export default router;
