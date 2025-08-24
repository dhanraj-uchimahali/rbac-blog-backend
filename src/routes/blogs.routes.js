import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PERMISSIONS } from "../constants/permissions.js";
import blogsController from "../controllers/blogs.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validatorMiddleware } from "../middleware/validator.middleware.js";
import { rbacMiddleware } from "../middleware/rbac.middleware.js";
import { createBlogSchema, updateBlogSchema, updateBlogParamsSchema, deleteBlogSchema, fetchBlogParamsSchema } from "../schema/blogs.schema.js";

const router = express.Router();

const getTimeStamp = () => {
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
    const date = currentDateTime.getDate().toString().padStart(2, '0');
    const hours = currentDateTime.getHours().toString().padStart(2, '0');
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentDateTime.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${date}_${hours}-${minutes}-${seconds}`;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        const folderName = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const dir = path.join(__dirname, '../../', 'temp', folderName)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },

    filename: (req, file, cb) => {
        const timestamp = getTimeStamp();
        const randomString = Math.random().toString(36).substring(2, 7);
        const extension = path.extname(file.originalname)
        cb(null, `${randomString}_${timestamp}${extension}`);
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// route_name : /blogs
// route_description : Endpoint to retrieve all active blogs
router.get(
  "/",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.VIEW_ALL_BLOGS]),
  blogsController.fetchAll
);

// route_name : /blogs/:blogId
// route_description : Endpoint to retrieve blog data on the basis of id
router.get(
  "/:blogId",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.VIEW_BLOG]),
  validatorMiddleware({ params: fetchBlogParamsSchema }),
  blogsController.fetchOne
);

// route_name : /blogs
// route_description : Endpoint to create a new blog
router.post(
  "/",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.CREATE_BLOG]),
  validatorMiddleware({ body: createBlogSchema }),
  blogsController.create
);

// route_name : /blogs/:blogId
// route_description : Endpoint to update an existing blog by id
router.put(
  "/:blogId",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.UPDATE_ANY_BLOG, PERMISSIONS.UPDATE_BLOG]),
  validatorMiddleware({
    body: updateBlogSchema,
    params: updateBlogParamsSchema,
  }),
  blogsController.update
);

// route_name : /blogs/:blogId
// route_description : Endpoint to delete an existing blog by id
router.delete(
  "/:blogId",
  authMiddleware,
  rbacMiddleware([PERMISSIONS.DELETE_ANY_BLOG, PERMISSIONS.DELETE_BLOG]),
  validatorMiddleware({ params: deleteBlogSchema }),
  blogsController.delete
);

// route_name : /blogs/image-upload
// route_description : Endpoint to upload images in temp folder
router.post(
  "/image-upload",
  upload.array('images', 3),
  blogsController.imageUpload
);

export default router;
