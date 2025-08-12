/* eslint-disable no-console */

import "dotenv/config";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const port = process.env.PORT || 3000;

// Bootstrap the application
const bootstrap = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.rjxsn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster1`
    );
    console.log("Successfully connected to MongoDB using Mongoose");

    // Start the server
    server = app.listen(port, () => {
      console.log(`Server running on port ${process.env.port}`);
    });
  } catch (error) {
    console.error({
      message: "MongoDB connection failed",
      error,
    });
    process.exit(1);
  }
};

// Start the application
bootstrap();

// Graceful shutdown handlers
const handleExit = (signal: string, error?: unknown) => {
  const errorPayload = error ? { error } : {};

  console.error({
    message: `${signal} received. Server shutting down...`,
    ...errorPayload,
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

// Server termination signals
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGINT", () => handleExit("SIGINT"));
