import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { sequelize } from "../../db/mysql.js";
import { DataTypes } from "sequelize";

const __filename =fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

async function loadModels() {
  // Read all model files
  const files = fs.readdirSync(__dirname)
    .filter(file => file !== "index.js" && file.endsWith(".js"));

  // Dynamically import each model
  for (const file of files) {
     const modelPath = path.join(__dirname, file);
    const { default: modelDef } = await import(pathToFileURL(modelPath).href);
    const model = modelDef(sequelize, DataTypes);
    db[model.name] = model;
  }

  // Set up associations if defined
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  // Add Sequelize instance
  db.sequelize = sequelize;

  return db;
}
await loadModels()
export default db;
