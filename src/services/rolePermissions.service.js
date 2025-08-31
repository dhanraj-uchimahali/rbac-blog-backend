import CustomError from "../utils/customError.js";
import db from "../models/mysql/index.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";

const rolePermissionsService = {};

rolePermissionsService.create = async ({ roleType, permissionDescription }) => {
  logger.success.info({
    stage: "CREATE_ROLE_PERMISSION",
    msg: "Role permission creation started",
    roleType,
    permissionDescription,
  });
  
  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne(
    {
    where: { name: roleType, is_active: 1 },
      raw: true
    },
  );

  if (!roleData) {
    logger.error.error({
      stage: "CREATE_ROLE_PERMISSION",
      msg: "Role permission creation failed - Role not found",
      roleType,
      permissionDescription,
    });
    throw new CustomError(404, "Role not found");
  }

  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: { description: permissionDescription, is_active: 1 },
    raw: true
  });

  if (!permissionData) {
    logger.error.error({
      stage: "CREATE_ROLE_PERMISSION",
      msg: "Role permission creation failed - Permission not found",
      roleType,
      permissionDescription,
    });
    throw new CustomError(404, "Permission not found");
  }

  /* Check whether mentioned role permission exists or not */
  const rolePermissionsData = await db.RolePermission.findOne({
    where: {
      role_id: roleData.role_id,
      permission_id: permissionData.permission_id,
    },
  });

  if (rolePermissionsData) {
    logger.error.error({
      stage: "CREATE_ROLE_PERMISSION",
      msg: "Role permission creation failed - Role permission already exists",
      roleType,
      permissionDescription,
    });
    throw new CustomError(400, "Role permission already exists");
  }

  /* Insert data in permissions table */
  await db.RolePermission.create({
    role_id: roleData.role_id,
    permission_id: permissionData.permission_id,
  });

  logger.success.info({
    stage: "CREATE_ROLE_PERMISSION",
    msg: "Role permission created successfully",
    roleType,
    permissionDescription,
  });
};

rolePermissionsService.fetchAll = async ({ search, limit, offset }) => {
  logger.success.info({
    stage: "FETCH_ROLE_PERMISSIONS",
    msg: "Role Permission data fetch initiated",
  });

  let whereCondition = { is_active: 1 };

  if (search) {
    whereCondition[Op.or] = [
      { "role.name": { [Op.like]: `%${search}%` } },
      { "permissions.description": { [Op.like]: `%${search}%` } },
    ];
  }

  /* Fetch all permissions assigned role wise */
  const permissionDetails = await db.RolePermission.findAll({
    where: whereCondition,
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
        attributes: ["name", "description"],
      },
    ],
    limit: limit || 10,
    offset: offset || 0,
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

  logger.success.info({
    stage: "FETCH_ROLE_PERMISSIONS",
    msg: "Role permissions fetched successfully",
  });

  return response
};

rolePermissionsService.fetchOne = async ({ rolePermissionId }) => {
  logger.success.info({
    stage: "FETCH_ROLE_PERMISSION",
    msg: "Role permission data fetch initiated",
    rolePermissionId,
  });

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

  if (!permissionDetails) {
    logger.error.error({
      stage: "FETCH_ROLE_PERMISSION",
      msg: "Role permission data fetch failed - Role permission not found",
      rolePermissionId,
    });
    throw new CustomError(404, "Role permission not found")
  }

  const response = {
    roleId: permissionDetails[0]["roleId"],
    permissionId: permissionDetails[0]["permissionId"],
    roleType: permissionDetails[0]["role.name"],
    permissionName: permissionDetails[0]["permissions.name"],
  };
  
  logger.success.info({
    stage: "FETCH_ROLE_PERMISSION",
    msg: "Role permission fetched successfully",
    rolePermissionId,
  });

  return response;
};

rolePermissionsService.update = async ({ rolePermissionId, roleType, permissionDescription }) => {
  logger.success.info({
    stage: "UPDATE_ROLE_PERMISSION",
    msg: "Role permission update process started",
    rolePermissionId,
    roleType,
    permissionDescription,
  });

  /* Check whether mentioned role permission exists or not */
  const rolePermissionsData = await db.RolePermission.findOne({
    where: { role_permission_id: rolePermissionId },
  });

  if (!rolePermissionsData) {
    logger.error.error({
      stage: "UPDATE_ROLE_PERMISSION",
      msg: "Role permission update process failed - Role permission not found",
      rolePermissionId,
      roleType,
      permissionDescription,
    });
    throw new CustomError(404, "Role permission not found")
  }

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { name: roleType, is_active: 1 },
    raw: true
  });

  if (!roleData) {
    logger.error.error({
      stage: "UPDATE_ROLE_PERMISSION",
      msg: "Role permission update process failed - Role not found",
      rolePermissionId,
      roleType,
      permissionDescription,
    });
    throw new CustomError(404, "Role not found");
  }

  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: { description: permissionDescription, is_active: 1 },
    raw: true
  });

  if (!permissionData) {
    logger.error.error({
      stage: "UPDATE_ROLE_PERMISSION",
      msg: "Role permission update process failed - Permission not found",
      rolePermissionId,
      roleType,
      permissionDescription,
    });
    throw new CustomError(404, "Permission not found");
  }

  /* Update data in permissions table */
  await db.RolePermission.update(
    { role_id: roleData.role_id, permission_id: permissionData.permission_id },
    { where: { role_permission_id: rolePermissionId } }
  );

  logger.success.info({
    stage: "UPDATE_ROLE_PERMISSION",
    msg: "Role permission updated successfully",
    rolePermissionId,
    roleType,
    permissionDescription,
  });
};

rolePermissionsService.delete = async ({ rolePermissionId }) => {
  logger.success.info({
    stage: "DELETE_ROLE_PERMISSION",
    msg: "Role permission delete process started",
    rolePermissionId,
  });

  /* Check whether mentioned permission exists or not */
  const rolePermissionData = await db.RolePermission.findOne({
    where: { role_permission_id: rolePermissionId, is_active: 1 }
  });

  if (!rolePermissionData) {
    logger.error.error({
      stage: "DELETE_ROLE_PERMISSION",
      msg: "Role permission delete process failed - Role Permission not found",
      rolePermissionId,
    });
    throw new CustomError(404, "Role Permission not found");
  }

  /* Update data in users table */
  await db.RolePermission.update({ is_active: 0 }, { where: { role_permission_id: rolePermissionId } });

  logger.success.info({
    stage: "DELETE_ROLE_PERMISSION",
    msg: "Role permission deleted successfully",
    rolePermissionId,
  });
};

export default rolePermissionsService;
