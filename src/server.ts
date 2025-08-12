import "dotenv/config";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const port = process.env.PORT || 3000;

const bootstrap = async () => {
  try {
    // mongoDB connector
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.rjxsn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster1`
    );
    console.log("Successfully connected to MongoDB using Mongoose");

    // server listener
    server = app.listen(port, () => {
      console.log(`Server running on... ${process.env.port}`);
    });
  } catch (error) {
    console.error({
      message: "MongoDB connection failed",
      error,
    });
    process.exit(1);
  }
};

bootstrap();
