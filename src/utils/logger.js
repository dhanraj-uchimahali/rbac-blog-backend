import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = {};

logger.warn = winston.createLogger({
  level: "warn",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((params) => {
      const { timestamp, level, message } = params;
      return `${timestamp} ${level}: \n${JSON.stringify(message)}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/%DATE%-warn.log",
      datePattern: "YYYY-MM-DD",
      level: "warn",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    })
  ],
});

logger.success = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const { timestamp, level, message } = info;
      return `${timestamp} ${level}: \n${JSON.stringify(message)}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/%DATE%-success.log",
      datePattern: "YYYY-MM-DD",
      level: "info",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    })
  ],
});

logger.error = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((error) => {
      const { timestamp, level, message } = error;
      return `${timestamp} ${level}: \n${JSON.stringify(message)}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: "logs/%DATE%-error.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "90d",
    })
  ],
});

export default logger;
