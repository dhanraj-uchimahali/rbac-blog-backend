import express from "express";
import usersRoutes from "./users.routes.js";
import rolesRoutes from './roles.routes.js';
import permissionsRoutes from './permissions.routes.js';
import rolePermissionsRoutes from './rolePermissions.routes.js';
import blogsRoutes from './blogs.routes.js';

const router = express.Router();

/* User Routes */
router.use("/users", usersRoutes);

/* RBAC Routes */
router.use("/roles", rolesRoutes);
router.use("/permissions", permissionsRoutes);
router.use("/role-permissions", rolePermissionsRoutes);

/* Blog Routes */
router.use("/blogs", blogsRoutes)

export default router;