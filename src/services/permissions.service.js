import CustomError from "../utils/customError.js";
import db from "../models/mysql/index.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";

const permissionsService = {};

permissionsService.fetchAll = async ({ search }) => {
  logger.success.info({
    stage: "FETCH_PERMISSIONS",
    msg: "Permissions data fetch initiated",
  });

  let whereCondition = { is_active: 1 };

  if (search) {
    whereCondition.description = { [Op.like]: `%${search}%` };
  }

  /* Fetch all active permissions */
  const permissionDetails = await db.Permission.findAll({
    where: whereCondition,
    attributes: ["permission_id", "name", "description"]
  });

  logger.success.info({
    stage: "FETCH_PERMISSIONS",
    msg: "Permissions fetched successfully",
  });

  return permissionDetails;
};

permissionsService.fetchOne = async ({ permissionId }) => {
  logger.success.info({
    stage: "FETCH_PERMISSION",
    msg: "Permission data fetch initiated",
    permissionId,
  });
  
  /* Fetch all active permissions */
  const permissionDetail = await db.Permission.findOne({
    where: { permission_id: permissionId, is_active: 1 },
    attributes: ["permission_id", "name", "description"],
    raw: true
  });

  if (!permissionDetail) {
    logger.error.error({
      stage: "FETCH_PERMISSION",
      msg: "Permission data fetch failed - Permission not found",
      roleId,
    });
    throw new CustomError(404, "Permission not found");
  }
  
  logger.success.info({
    stage: "FETCH_PERMISSION",
    msg: "Permission fetched successfully",
    permissionId,
  });
  
  return permissionDetail;
};

permissionsService.create = async ({ name, description }) => {
  logger.success.info({
    stage: "CREATE_PERMISSION",
    msg: "Permission creation started",
    name,
    description,
  });

  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: { name: name, is_active: 1 },
  });

  if (permissionData) {
    logger.error.error({
      stage: "CREATE_PERMISSION",
      msg: "Permission creation failed - Permission already exists",
      name,
      description,
    });
    throw new CustomError(400, "Permission already exists");
  }

  /* Insert data in permissions table */
  await db.Permission.create({ name: name, description: description });

  logger.success.info({
    stage: "CREATE_PERMISSION",
    msg: "Permission created successfully",
    name,
    description,
  });
};

permissionsService.update = async ({ permissionId, name, description }) => {
  logger.success.info({
    stage: "UPDATE_PERMISSION",
    msg: "Permission update process started",
    permissionId,
    name,
    description,
  });

  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: { permission_id: permissionId, is_active: 1 },
  });

  if (!permissionData) {
    logger.error.error({
      stage: "UPDATE_PERMISSION",
      msg: "Permission update process failed - Permission not found",
      permissionId,
      name,
      description,
    });
    throw new CustomError(404, "Permission not found");
  }

  /* Update data in permissions table */
  await db.Permission.update(
    { name: name, description: description },
    { where: { permission_id: permissionId } }
  );

  logger.success.info({
    stage: "UPDATE_PERMISSION",
    msg: "Permission updated successfully",
    permissionId,
    name,
    description,
  });
};

permissionsService.delete = async ({ permissionId }) => {
  logger.success.info({
    stage: "DELETE_PERMISSION",
    msg: "Permission delete process started",
    permissionId,
  });

  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: {permission_id: permissionId, is_active: 1 },
  });

  if (!permissionData) {
    logger.error.error({
      stage: "DELETE_PERMISSION",
      msg: "Permission delete process failed - Permission not found",
      permissionId,
    });
    throw new CustomError(404, "Permission not found");
  }

  /* Update data in users table */
  await db.Permission.update(
    { is_active: 0 },
    { where: { permission_id: permissionId } }
  );

  logger.success.info({
    stage: "DELETE_PERMISSION",
    msg: "Permission deleted successfully",
    permissionId,
  });
};

export default permissionsService;
