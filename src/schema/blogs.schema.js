import * as yup from "yup";

const createBlogSchema = yup.object({
  content: yup.object({
      body: yup.string().required("Content body is required"),
  }).required("Content is required"),
  title: yup.string().required("Title is required"),
  imageURL: yup.array().required('Image URL is required'),
});

const fetchBlogParamsSchema = yup.object({
  blogId: yup.string().required("Blog id is required").matches(/^\d+$/, "Only numbers are allowed")
});

const updateBlogSchema = yup.object({
  content: yup.object({
      body: yup.string().required("Content body is required"),
  }).required("Content is required"),
  title: yup.string().required("Title is required")
});

const updateBlogParamsSchema = yup.object({
  blogId: yup.string().required("Blog id is required").matches(/^\d+$/, "Only numbers are allowed")
});

const deleteBlogSchema = yup.object({
  blogId: yup.string().required("Blog id is required").matches(/^\d+$/, "Only numbers are allowed"),
});

export { createBlogSchema, updateBlogSchema, updateBlogParamsSchema, deleteBlogSchema, fetchBlogParamsSchema };
