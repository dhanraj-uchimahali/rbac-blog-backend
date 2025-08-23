import express from "express";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { mysqlConnection } from "./db/mysql.js";
import { redisConnection } from "./db/redis.js";
import { responseMiddleware } from "./middleware/response.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { config } from './constants/config.js';

const app = express();

app.use(cors({ origin: "*", credentials: true }));

// enable response compression
app.use(
  compression({
    filter: function (req, res) {
      if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
      }

      // fallback to standard filter function
      return compression.filter(req, res);
    },
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/", limiter);

// MySQL Connection
if (config.mysql.enabled) {
  mysqlConnection();
}

// Redis Connection
if (config.redis.enabled) {
  redisConnection();
}

// Enable middleware for parsing JSON request bodies
app.use(express.json({ limit: "2mb" }));

// Enable middleware for parsing text request bodies
app.use(express.text({ extended: true }));

// Enable middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Response Middleware
app.use(responseMiddleware);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is up and running....");
});

// Routes
app.use("/", routes);

// Error handling
app.use(errorMiddleware);

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}.`);
});

export default app;
