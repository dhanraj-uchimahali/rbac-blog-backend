import CustomError from "../utils/customError.js";
import db from "../models/mysql/index.js";

const permissionsService = {};

permissionsService.fetchAll = async ({ search }) => {
  let whereCondition = { is_active: 1 };
  if (search) {
    whereCondition.description = search;
  }
  /* Fetch all active permissions */
  const permissionDetails = await db.Permission.findAll({
    where: whereCondition,
    attributes: ["permission_id", "name", "description"]
  });

  return permissionDetails;
};

permissionsService.fetchOne = async ({ permissionId }) => {
  /* Fetch all active permissions */
  const permissionDetail = await db.Permission.findOne({
    where: { permission_id: permissionId, is_active: 1 },
    attributes: ["permission_id", "name", "description"],
    raw: true
  });

  if(!permissionDetail){
    throw new CustomError(404, "Permission data not found");
  }

  return permissionDetail;
};

permissionsService.create = async ({ name, description }) => {
  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: { name: name, is_active: 1 },
  });

  if (permissionData) {
    throw new CustomError(400, "Permission data already exists");
  }

  /* Insert data in permissions table */
  await db.Permission.create({ name: name, description: description });
};

permissionsService.update = async ({ permissionId, name, description }) => {
  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: {permission_id: permissionId, is_active: 1 },
  });

  if (!permissionData) {
    throw new CustomError(404, "Permission data not found");
  }

  /* Update data in permissions table */
  await db.Permission.update(
    { name: name, description: description },
    { where: { permission_id: permissionId } }
  );
};

permissionsService.delete = async ({ permissionId }) => {
  /* Check whether mentioned permission exists or not */
  const permissionData = await db.Permission.findOne({
    where: {permission_id: permissionId, is_active: 1 },
  });

  if (!permissionData) {
    throw new CustomError(404, "Permission data not found");
  }

  /* Update data in users table */
  await db.Permission.update({ is_active: 0 }, { where: { permission_id: permissionId } });
};

export default permissionsService;
