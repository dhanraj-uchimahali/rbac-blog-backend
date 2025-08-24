import { asyncHandler } from "../utils/asyncHandler.js";
import blogsService from "../services/blogs.service.js";
import CustomError from "../utils/customError.js";
import path from "path";

const blogsController = {};

blogsController.create = asyncHandler(async (req, res) => {
  const result = await blogsService.create({
    content: req.body.content,
    title: req.body.title,
    imageURL: req.body.imageURL,
    userId: req.userId
  });
  res.success(result, "Blog created successfully.", 201);
});

blogsController.fetchAll = asyncHandler(async (req, res) => {
  const result = await blogsService.fetchAll({
    search: req.query.search,
    limit: req.query.limit,
    offset: req.query.offset,
  });
  res.success(result, "Blogs fetched successfully.", 200);
});

blogsController.fetchOne = asyncHandler(async (req, res) => {
  const result = await blogsService.fetchOne({ blogId: req.params.blogId });
  res.success(result, "Blog fetched successfully.", 200);
});

blogsController.update = asyncHandler(async (req, res) => {
  const result = await blogsService.update({
    blogId: req.params.blogId,
    title: req.body.title,
    content: req.body.content,
    imageURL: req.body.imageURL,
    userId: req.userId,
    roleType: req.roleType
  });
  res.success(result, "Blog updated successfully.", 200);
});

blogsController.delete = asyncHandler(async (req, res) => {
  const result = await blogsService.delete({ blogId: req.params.blogId, userId: req.userId, roleType: req.roleType });
  res.success(result, "Blog deleted successfully.", 200);
});

blogsController.imageUpload = asyncHandler(async (req, res) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 5242880;

  if (!req.files || req.files.length === 0) {
    throw new CustomError(400, "Image is not uploaded");
  }

  /* File validation */
  req.files.forEach((file) => {
    const fileExtension = path.extname(file.filename);
    if (!allowedExtensions.includes(fileExtension)) {
      throw new CustomError(400, "Only JPG and PNG image files are allowed.");
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new CustomError(400, "Invalid file type. Only JPG and PNG formats are supported.");
    }

    if (file.size > maxFileSize) {
      throw new CustomError(400, "The uploaded image exceeds the 5MB size limit. Please upload a smaller file.");
    }
  });
  
  const result = await blogsService.imageUpload({ files: req.files });
  res.success(result, "Image uploaded successfully.", 200);
});

export default blogsController;
