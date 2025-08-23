import * as yup from "yup";

const userLoginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const fetchUserParamsSchema = yup.object({
  userId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("User id is required"),
});

const createUserSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup.string().required("Confirm password is required"),
  roleType: yup.string().required("Role type is required"),
});

const updateUserSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  roleType: yup.string().required("Role type is required"),
});

const updateUserParamsSchema = yup.object({
  userId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("User id is required"),
});

const deleteUserSchema = yup.object({
  userId: yup
    .string()
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .required("User id is required"),
});

export {
  createUserSchema,
  fetchUserParamsSchema,
  updateUserSchema,
  updateUserParamsSchema,
  deleteUserSchema,
  userLoginSchema,
};
