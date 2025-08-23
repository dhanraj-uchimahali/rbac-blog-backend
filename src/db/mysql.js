import { Sequelize } from "sequelize";
import { config } from '../constants/config.js'

// Initialize Sequelize instance with MySQL connection config
const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
  host: config.mysql.host,
  port: config.mysql.port,
  dialect: "mysql",
  pool: {
    max: parseInt(config.mysql.connectionLimit),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: { max: 3 }
});

// Async function to handle database connection and model synchronization
const mysqlConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    // await sequelize.sync({ force: true });
    // console.log("Database synchronized.");
  } catch (error) {
    // Handle and log connection/sync errors
    console.error("Database connection/sync failed:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};
export {sequelize, mysqlConnection};
