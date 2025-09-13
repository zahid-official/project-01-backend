/* eslint-disable no-console */

import app from "./app";
import { Server } from "http";
import mongoose from "mongoose";
import envVars from "./app/config/env";
import connectRedis from "./app/config/redis";
import superAdmin from "./app/utils/superAdmin";

let server: Server;
const port = envVars.PORT || 3000;

// Initialize the application
const bootstrap = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(envVars.DB_URL);
    console.log("Successfully connected to MongoDB using Mongoose");

    // Start the express server
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error({
      success: false,
      message: "MongoDB connection failed",
      error,
    });
    process.exit(1);
  }
};

// Initialize the application
(async () => {
  await connectRedis();
  await bootstrap();
  await superAdmin();
})();

// Graceful shutdown handlers
const handleExit = (signal: string, error?: unknown) => {
  const errorInfo = error ? { error } : {};

  console.error({
    message: `${signal} received. Server shutting down...`,
    ...errorInfo,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Unhandled promise rejection
process.on("unhandledRejection", (error) => {
  handleExit("Unhandled Rejection", error);
});

// Uncaught exception
process.on("uncaughtException", (error) => {
  handleExit("Uncaught Exception", error);
});

// Process termination signals
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGINT", () => handleExit("SIGINT"));
