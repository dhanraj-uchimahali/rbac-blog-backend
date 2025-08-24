import CustomError from "../utils/customError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../models/mysql/index.js";
import config from "../constants/config.js";
import { ROLES } from "../constants/roles.js";

const blogsService = {};

blogsService.fetchAll = async ({ search, limit, offset }) => {
  let whereCondition = { is_active: 1 };

  if (search) {
    whereCondition.title = search;
  }

  /* Fetch all active blogs data */
  const blogsDetails = await db.Blogs.findAll({
    where: whereCondition,
    attributes: ["blog_id", "title", "user_id", "content", "image_url"],
    include: {
      model: db.User,
      as: "author",
      attributes: ["full_name", "email"],
    },
    limit: limit || 10,
    offset: offset || 0,
    raw: true,
  });

  const response = blogsDetails.map((element) => {
    return {
      blogId: element["blog_id"],
      userId: element["user_id"],
      userName: element["author.full_name"],
      userEmail: element["author.email"],
      title: element["title"],
      content: element["content"],
      imageURL: element.image_url.map((url) => (
       `${config.nodeEndpoint}/${url}`
      ))
    };
  });

  return response;
};

blogsService.fetchOne = async ({ blogId }) => {
  /* Fetch active blog data on the basis of blogId */
  const blogData = await db.Blogs.findOne({
    where: { blog_id: blogId, is_active: 1 },
    attributes: ["blog_id", "title", "user_id", "content", "image_url"],
    include: {
      model: db.User,
      as: "author",
      attributes: ["full_name", "email"],
    },
    raw: true,
  });

  if (!blogData) {
    throw new CustomError(400, "Blog data not found");
  }

  const response = {
      blogId: blogData["blog_id"],
      userId: blogData["user_id"],
      userName: blogData["author.full_name"],
      userEmail: blogData["author.email"],
      title: blogData["title"],
      content: blogData["content"],
      imageURL: blogData['image_url'].map((url) => (
       `${config.nodeEndpoint}/${url}`
      ))
    }
  return response;
};

blogsService.create = async ({ content, title, imageURL, userId }) => {
  /* Check whether mentioned blog exists or not */
  const blogData = await db.Blogs.findOne({
    where: { title: title, is_active: 1 },
    raw: true,
  });

  if (blogData) {
    throw new CustomError(400, "Blog data already exists");
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const imageUploadURL = [];

  const tempFolders = [...new Set(imageURL.map((image) => {
    const pathname = new URL(image).pathname;
    const parts = pathname.split('/');
    const uploadPath = path.join('uploads', parts[2], parts[3]).replaceAll('\\', '/');
    imageUploadURL.push(uploadPath)
    return path.join(parts[1], parts[2]);
  }))];

  tempFolders.forEach((folderRelativePath) => {
    const sourcePath = path.join(__dirname, '../../', folderRelativePath);
    const folderName = path.basename(folderRelativePath);
    const destinationPath = path.join(__dirname, '../../', 'uploads', folderName);
    /* If directory doesn't exists create the directory */
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    /* Copy files from temp → uploads */
    fs.cpSync(sourcePath, destinationPath, { recursive: true });
    
    /* Delete temp folder after successful copy */
    fs.rmSync(sourcePath, { recursive: true, force: true });
  });

  /* Insert data in blogs table */
  await db.Blogs.create({
    title: title,
    content: content,
    image_url: imageUploadURL,
    user_id: userId
  });
};

blogsService.update = async ({ blogId, title, content, imageURL, userId, roleType }) => {
  /* Check whether mentioned blog exists or not */
  const blogData = await db.Blogs.findOne({
    where: { blog_id: blogId, is_active: 1 },
    raw: true,
  });

  if (!blogData) {
    throw new CustomError(400, "Blog data not found");
  }

  /* Authorization check for updating blog */
  if(roleType === ROLES.AUTHOR && blogData && blogData.user_id !== userId){
    throw new CustomError(403, "Forbidden: You can only modify your own blog");
  }

  const imageUploadURL = [];
  if(imageURL && imageURL.length > 0){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tempFolders = [...new Set(imageURL.map((image) => {
      const pathname = new URL(image).pathname;
      const parts = pathname.split('/');
      const uploadPath = path.join('uploads', parts[2], parts[3]).replaceAll('\\', '/');
      imageUploadURL.push(uploadPath)
      return path.join(parts[1], parts[2]);
    }))];

    tempFolders.forEach((folderRelativePath) => {
      const sourcePath = path.join(__dirname, "../../", folderRelativePath);
      const folderName = path.basename(folderRelativePath);
      const destinationPath = path.join(__dirname, "../../", "uploads", folderName);

      /* If directory doesn't exists create the directory */
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }

      /* Copy files from temp → uploads */
      fs.cpSync(sourcePath, destinationPath, { recursive: true });

      /* Delete temp folder after successful copy */
      fs.rmSync(sourcePath, { recursive: true, force: true });
    });
  }

  /* Update data in blogs table */
  await db.Blogs.update(
    {
      title: title,
      content: content,
      image_url: imageUploadURL ? imageUploadURL : blogData.image_url,
      user_id: userId,
    },
    {
      where: { blog_id: blogId },
    }
  );
};

blogsService.delete = async ({ blogId, userId, roleType }) => {
  /* Check whether mentioned blog exists or not */
  const blogData = await db.Blogs.findOne({
    where: { blog_id: blogId, is_active: 1 },
    raw: true,
  });

  if (!blogData) {
    throw new CustomError(400, "Blog data not found");
  }
  
  /* Authorization check for updating blog */
  if(roleType === ROLES.AUTHOR && blogData && blogData.user_id !== userId){
    throw new CustomError(403, "Forbidden: You can only delete your own blog");
  }

  /* Update data in users table */
  await db.Blogs.update({ is_active: 0 }, { where: { blog_id: blogId } });
};

blogsService.imageUpload = async ({ files }) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const result = files.map((element) => {
        let relativePath = path.relative(path.resolve(__dirname, '../../'), element.path);
        relativePath = relativePath.split(path.sep).join('/');
        const publicUrl = `${config.nodeEndpoint}/${relativePath}`;
        return publicUrl;
    });
    return result
};

export default blogsService;
