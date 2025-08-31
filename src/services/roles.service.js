import CustomError from "../utils/customError.js";
import db from "../models/mysql/index.js";
import logger from "../utils/logger.js";
import { Op } from "sequelize";

const rolesService = {};

rolesService.fetchAll = async ({ search }) => {
  logger.success.info({
    stage: "FETCH_ROLES",
    msg: "Roles data fetch initiated"
  });

  let whereCondition = { is_active: 1 };
  if (search) {
    whereCondition.name = { [Op.like]: `%${search}%` };
  }

  /* Fetch all active roles */
  const roleDetails = await db.Roles.findAll({
    where: whereCondition,
    attributes: ["role_id", "name"],
  });

  logger.success.info({
    stage: "FETCH_ROLES",
    msg: "Roles fetched successfully"
  });

  return roleDetails;
};

rolesService.fetchOne = async ({ roleId }) => {
  logger.success.info({
    stage: "FETCH_ROLE",
    msg: "Role data fetch initiated",
    roleId,
  });

  /* Fetch role data on the basis of role_id */
  const roleDetail = await db.Roles.findOne({
    where: { role_id: roleId, is_active: 1 },
    attributes: ["role_id", "name"],
  });

  if (!roleDetail) {
    logger.error.error({
      stage: "FETCH_ROLE",
      msg: "Role data fetch failed - Role not found",
      roleId,
    });
    throw new CustomError(404, "Role not found");
  }

  logger.success.info({
    stage: "FETCH_ROLE",
    msg: "Role fetched successfully",
    roleId,
  });
  
  return roleDetail;
};

rolesService.create = async ({ name }) => {
  logger.success.info({
    stage: "CREATE_ROLE",
    msg: "Role creation started",
    name,
  });

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { name: name, is_active: 1 },
  });

  if (roleData) {
    logger.error.error({
      stage: "CREATE_ROLE",
      msg: "Role creation failed - Role data exists",
      name,
    });
    throw new CustomError(400, "Role data exists");
  }

  /* Insert data in roles table */
  await db.Roles.create({ name: name });

  logger.success.info({
    stage: "CREATE_ROLE",
    msg: "Role created successfully",
    name,
  });
};

rolesService.update = async ({ roleId, name }) => {
  logger.success.info({
    stage: "UPDATE_ROLE",
    msg: "Role update process started",
    roleId,
    name,
  });

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { role_id: roleId, is_active: 1 },
  });

  if (!roleData) {
    logger.error.error({
      stage: "UPDATE_ROLE",
      msg: "Role update process failed - Role not found",
      roleId,
      name,
    });
    throw new CustomError(404, "Role not found");
  }

  /* Update data in roles table */
  await db.Roles.update({ name: name }, { where: { role_id: roleId } });

  logger.success.info({
    stage: "UPDATE_ROLE",
    msg: "Role updated successfully",
    roleId,
    name,
  });
};

rolesService.delete = async ({ roleId }) => {
  logger.success.info({
    stage: "DELETE_ROLE",
    msg: "Role delete process started",
    roleId,
  });

  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { role_id: roleId, is_active: 1 },
  });

  if (!roleData) {
    logger.error.error({
      stage: "DELETE_ROLE",
      msg: "Role delete process failed - Role not found",
      roleId,
    });
    throw new CustomError(404, "Role not found");
  }

  /* Update data in roles table */
  await db.Roles.update({ is_active: 0 }, { where: { role_id: roleId } });

  logger.success.info({
    stage: "DELETE_ROLE",
    msg: "Role deleted successfully",
    roleId,
  });
};

export default rolesService;
