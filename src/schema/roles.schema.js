import * as yup from "yup";

const createRoleSchema = yup.object({
  name: yup.string().required("Role name is required"),
});

const fetchRoleParamsSchema = yup.object({
  roleId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("Role id is required"),
});

const updateRoleSchema = yup.object({
  name: yup.string().required("Role name is required"),
});

const updateRoleParamsSchema = yup.object({
  roleId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("Role id is required"),
});

const deleteRoleSchema = yup.object({
  roleId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("Role id is required"),
});

export { createRoleSchema, fetchRoleParamsSchema, updateRoleSchema, updateRoleParamsSchema, deleteRoleSchema };
