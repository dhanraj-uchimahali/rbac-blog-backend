import dotenv from "dotenv";
dotenv.config();

export const config = {
  // Server Configuration
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  nodeEndpoint: process.env.NODE_ENDPOINT,

  // Database Configuration
  mysql: {
    enabled: process.env.MYSQL_ENABLED === "true",
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
  },

  // Redis Configuration
  redis: {
    enabled: process.env.REDIS_ENABLED === "true",
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.REFRESH_JWT_SECRET,
    refreshExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN,
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL,
    file: process.env.LOG_FILE,
  },
};

export default config;
