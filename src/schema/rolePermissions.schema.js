import * as yup from "yup";

const createRolePermissionsSchema = yup.object({
  roleType: yup.string().required("Role type is required"),
  permissionDescription: yup.string().required("Permission description is required")
});

const fetchRolePermissionSchema = yup.object({
  rolePermissionId: yup.string().matches(/^[0-9]+$/, "Only numbers are allowed").required("Role permission id is required")
})

const updateRolePermissionsSchema = yup.object({
  roleType: yup.string().required("Role type is required"),
  permissionDescription: yup.string().required("Permission description is required")
});

const updateRolePermissionsParamsSchema = yup.object({
  rolePermissionId: yup.string().matches(/^[0-9]+$/, "Only numbers are allowed").required("Role permission id is required")
})

const deleteRolePermissionsSchema = yup.object({
  rolePermissionId: yup.string().matches(/^[0-9]+$/, "Only numbers are allowed").required("Role permission id is required")
});

export { createRolePermissionsSchema, fetchRolePermissionSchema, updateRolePermissionsSchema, updateRolePermissionsParamsSchema, deleteRolePermissionsSchema }