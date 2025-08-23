import CustomError from "../utils/customError.js";
import db from "../models/mysql/index.js";

const rolePermissionsService = {};

rolePermissionsService.create = async ({ roleType, permissionDescription }) => {
  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne(
    {
      where: { name: roleType, is_active: 1 },
      raw: true
    },
  );

  if (!roleData) {
    throw new CustomError(400, "Role data not found");
  }

  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: { description: permissionDescription, is_active: 1 },
    raw: true
  });

  if (!permissionData) {
    throw new CustomError(400, "Permission data not found");
  }

  /* Check whether mentioned role permission exists or not */
  const rolePermissionsData = await db.RolePermission.findOne({
    where: { role_id: roleData.role_id, permission_id: permissionData.permission_id },
  });

  if (rolePermissionsData) {
    throw new CustomError(400, "Role permissions data already exists");
  }

  /* Insert data in permissions table */
  await db.RolePermission.create({ role_id: roleData.role_id, permission_id: permissionData.permission_id });
};

rolePermissionsService.fetchAll = async () => {
  /* Fetch all permissions assigned role wise */
  const permissionDetails = await db.RolePermission.findAll({
    where: { is_active: 1 },
    attributes: [["role_id", "roleId"], ["permission_id", "permissionId"]],
    include: [
      {
        model: db.Roles,
        as: 'role',
        attributes: ["name"],
      },
      {
        model: db.Permission,
        as: 'permissions',
        attributes: ["name"],
      },
    ],
    raw: true
  });
 
  const parsedResponse = permissionDetails.map((element) => {
    return {
      roleId: element.roleId,
      permissionId: element.permissionId,
      roleType: element['role.name'],
      permissionName: element['permissions.name']
    }
  });

  /* Grouped permissions on the basis of role type */
  const response = Object.groupBy(parsedResponse, (element) => element.roleType)
  return response
};

rolePermissionsService.fetchOne = async ({ rolePermissionId }) => {
  /* Fetch role wise permission on the basis of rolePermissionId */
  const permissionDetails = await db.RolePermission.findAll({
    where: { role_permission_id: rolePermissionId, is_active: 1 },
    attributes: [
      ["role_id", "roleId"],
      ["permission_id", "permissionId"],
    ],
    include: [
      {
        model: db.Roles,
        as: "role",
        attributes: ["name"],
      },
      {
        model: db.Permission,
        as: "permissions",
        attributes: ["name"],
      },
    ],
    raw: true,
  });

  if(!permissionDetails){
    throw new CustomError(400, "Role permissions data not found")
  }

  const response = {
    roleId: permissionDetails[0]["roleId"],
    permissionId: permissionDetails[0]["permissionId"],
    roleType: permissionDetails[0]["role.name"],
    permissionName: permissionDetails[0]["permissions.name"],
  };
  return response;
};

rolePermissionsService.update = async ({ rolePermissionId, roleType, permissionDescription }) => {
  /* Check whether mentioned role permission exists or not */
  const rolePermissionsData = await db.RolePermission.findOne({
    where: { role_permission_id: rolePermissionId },
  });

  if (!rolePermissionsData) {
    throw new CustomError(400, "Role permissions data not found");
  }

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { name: roleType, is_active: 1 },
    raw: true
  });

  if (!roleData) {
    throw new CustomError(400, "Role data not found");
  }

  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: { description: permissionDescription, is_active: 1 },
    raw: true
  });

  if (!permissionData) {
    throw new CustomError(400, "Permission data not found");
  }

  /* Update data in permissions table */
  await db.RolePermission.update(
    { role_id: roleData.role_id, permission_id: permissionData.permission_id },
    { where: { role_permission_id: rolePermissionId } }
  );
};

rolePermissionsService.delete = async ({ rolePermissionId }) => {
  /* Check whether mentioned permission exists or not */
  const permissionData = await db.RolePermission.findOne({
    where: {role_permission_id: rolePermissionId, is_active: 1 },
  });

  if (!permissionData) {
    throw new CustomError(400, "Permission data not found");
  }

  /* Update data in users table */
  await db.RolePermission.update({ is_active: 0 }, { where: { role_permission_id: rolePermissionId } });
};

export default rolePermissionsService;
