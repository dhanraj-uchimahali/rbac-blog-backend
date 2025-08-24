import CustomError from "../utils/customError.js";
import db from "../models/mysql/index.js";

const rolesService = {};

rolesService.fetchAll = async ({ search }) => {
  let whereCondition = { is_active: 1 };
  if (search) {
    whereCondition.name = search;
  }
  /* Fetch all active roles */
  const roleDetails = await db.Roles.findAll({
    where: whereCondition,
    attributes: ["role_id", "name"],
  });

  return roleDetails;
};

rolesService.fetchOne = async ({ roleId }) => {
  /* Fetch role data on the basis of role_id */
  const roleDetail = await db.Roles.findOne({
    where: { role_id: roleId, is_active: 1 },
    attributes: ["role_id", "name"],
  });

  if (!roleDetail) {
    throw new CustomError(400, "Role data not found");
  }
  
  return roleDetail;
};

rolesService.create = async ({ name }) => {
  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { name: name, is_active: 1 },
  });

  if (roleData) {
    throw new CustomError(400, "Role data exists");
  }

  /* Insert data in roles table */
  await db.Roles.create({ name: name });
};

rolesService.update = async ({ roleId, name }) => {
  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { role_id: roleId, is_active: 1 },
  });

  if (!roleData) {
    throw new CustomError(400, "Role data not found");
  }

  /* Update data in roles table */
  await db.Roles.update({ name: name }, { where: { role_id: roleId } });
};

rolesService.delete = async ({ roleId }) => {
  /* Check whether mentioned role exists or not */
  const roleData = await db.Roles.findOne({
    where: { role_id: roleId, is_active: 1 },
  });

  if (!roleData) {
    throw new CustomError(400, "Role data not found");
  }

  /* Update data in roles table */
  await db.Roles.update({ is_active: 0 }, { where: { role_id: roleId } });
};

export default rolesService;
