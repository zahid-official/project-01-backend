"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let server;
const port = process.env.PORT || 3000;
// Bootstrap the application
const bootstrap = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.rjxsn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster1`);
        console.log("Successfully connected to MongoDB using Mongoose");
        // Start the server
        server = app_1.default.listen(port, () => {
            console.log(`Server running on port ${process.env.port}`);
        });
    }
    catch (error) {
        console.error({
            message: "MongoDB connection failed",
            error,
        });
        process.exit(1);
    }
});
// Start the application
bootstrap();
// Graceful shutdown handlers
const handleExit = (signal, error) => {
    const errorPayload = error ? { error } : {};
    console.error(Object.assign({ message: `${signal} received. Server shutting down...` }, errorPayload));
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    else {
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
