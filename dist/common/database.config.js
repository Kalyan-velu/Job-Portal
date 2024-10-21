"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uri = process.env.MONGO_URL;
if (!uri) {
    throw new Error('MONGO_URL is missing from env');
}
const dbConfig = {
    uri,
    options: {},
};
class Database {
    mongooseInstance;
    modelDir;
    maxRetries;
    retryDelay;
    constructor(modelsDir, maxRetries = 5, retryDelay = 5000) {
        // maxRetries: number of retries, retryDelay: in ms
        this.mongooseInstance = null;
        this.modelDir = modelsDir;
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
    }
    async delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async connectDB(retries = 0) {
        if (this.mongooseInstance)
            return;
        try {
            this.mongooseInstance = await mongoose_1.default.connect(dbConfig.uri, dbConfig.options);
            console.log('MongoDB connected successfully');
            // this.loadModels();
            return this.mongooseInstance;
        }
        catch (error) {
            console.error(`MongoDB connection error (attempt ${retries + 1}):`, error);
            if (retries < this.maxRetries) {
                console.log(`Retrying connection in ${this.retryDelay / 1000} seconds...`);
                await this.delay(this.retryDelay); // Wait before retrying
                return this.connectDB(retries + 1); // Retry connection
            }
            else {
                console.error('Max retries reached. Exiting...');
                process.exit(1); // Exit if maximum retries are reached
            }
        }
    }
}
const db = new Database('../models');
exports.default = db;
