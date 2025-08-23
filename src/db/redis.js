import redis from 'redis'
import { config } from '../constants/config.js';
const client = redis.createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
    reconnectStrategy: (retries) => {
      console.log(`Redis reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000); // Wait time between retries (max 3 sec)
    }
  }
});

const redisConnection = async () => {
  try {
    client.on("connect", () => {
      console.log("✅ Redis connected successfully");
    });

    client.on("ready", () => {
      console.log("⚡ Redis is ready to use");
    });

    client.on("end", () => {
      console.log("❌ Redis connection closed");
    });

    client.on("reconnecting", () => {
      console.log("♻️  Attempting to reconnect to Redis...");
    });

    client.on("error", (error) => {
      console.error("🚨 Redis connection error:", error.message);
    });

    await client.connect();

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\nClosing Redis connection...");
      await client.quit();
      console.log("Redis connection closed. Exiting process.");
      process.exit(0);
    };

    process.on("SIGINT", shutdown);  // Ctrl+C
    process.on("SIGTERM", shutdown); // Kill signals (e.g., Docker stop)

  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};

export { redisConnection, client };
