/* eslint-disable no-console */

import { createClient } from "redis";
import envVars from "./env";

// Create and configure Redis client
export const redisClient = createClient({
  username: envVars.RADIS.USERNAME,
  password: envVars.RADIS.PASSWORD,
  socket: {
    host: envVars.RADIS.HOST,
    port: Number(envVars.RADIS.PORT),
  },
});

// Handle Redis client errors
redisClient.on("error", (error) => {
  console.error("Redis client error", error);
});

// Connect to Redis
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Successfully connected to Redis");
  }
};

export default connectRedis;
