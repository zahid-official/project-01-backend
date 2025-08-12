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

// Unhandled promise rejection
process.on("unhandledRejection", (error) => {
  console.error({
    message: "Unhandled rejection detected. Server shutting down...",
    error,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Uncaught exception
process.on("uncaughtException", (error) => {
  console.error({
    message: "Uncaught exception detected. Server shutting down...",
    error,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Server termination signals
process.on("SIGTERM", () => {
  console.error("SIGTERM signal received. Server shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Manually terminate the server
process.on("SIGINT", () => {
  console.error("SIGINT signal received. Server shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
