import { ROLE_PERMISSIONS } from '../constants/rolePermissions.js';
import CustomError from '../utils/customError.js';

export const rbacMiddleware = (requiredPermissions) => {
  return (req, res, next) => {
    const rolePermissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    
    if (!req.userId || !req.roleType) {
      throw new CustomError(401, "Unauthorized access");
    }
    
    const usersRolePermission = ROLE_PERMISSIONS[req.roleType] || [];
    const hasPermission = rolePermissions.some((permission) => usersRolePermission.includes(permission));

    if (!hasPermission) {
      throw new CustomError(403, "Forbidden: insufficient permissions");
    }
    next();
  };
};