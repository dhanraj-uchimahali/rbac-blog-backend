import winston from "winston";

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
    new winston.transports.File({
      filename: "logs/warn.log",
      level: "warn",
    }),
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
    new winston.transports.File({
      filename: "logs/success.log",
      level: "info",
    }),
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
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

export default logger;
