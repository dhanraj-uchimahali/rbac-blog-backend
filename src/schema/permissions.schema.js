import * as yup from "yup";

const createPermissionSchema = yup.object({
  name: yup.string().required("Permission name is required"),
  description: yup.string().required("Permission description is required"),
});

const fetchPermissionParamsSchema = yup.object({
  permissionId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("User id is required"),
});

const updatePermissionSchema = yup.object({
  name: yup.string().required("Permission name is required"),
  description: yup.string().required("Permission description is required"),
});

const updatePermissionParamsSchema = yup.object({
  permissionId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("Permission id is required"),
});

const deletePermissionSchema = yup.object({
  permissionId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("Permission id is required"),
});

export { createPermissionSchema, fetchPermissionParamsSchema, updatePermissionSchema, updatePermissionParamsSchema, deletePermissionSchema };
