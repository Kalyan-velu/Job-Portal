import mongoose from 'mongoose';

const uri = process.env.MONGO_URL;
if (!uri) {
  throw new Error('MONGO_URL is missing from env');
}

const dbConfig: {
  uri: string;
  options: mongoose.ConnectOptions;
} = {
  uri,
  options: {},
};

class Database {
  public mongooseInstance: typeof mongoose | null;
  private modelDir: string;
  private  maxRetries: number;
  private  retryDelay: number;

  constructor(modelsDir: string, maxRetries = 5, retryDelay = 5000) {
    // maxRetries: number of retries, retryDelay: in ms
    this.mongooseInstance = null;
    this.modelDir = modelsDir;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async connectDB(retries = 0): Promise<typeof mongoose | void> {
    if (this.mongooseInstance) return;

    try {
      this.mongooseInstance = await mongoose.connect(
        dbConfig.uri,
        dbConfig.options,
      );
      console.log('MongoDB connected successfully');
      // this.loadModels();
      return this.mongooseInstance;
    } catch (error) {
      console.error(
        `MongoDB connection error (attempt ${retries + 1}):`,
        error,
      );

      if (retries < this.maxRetries) {
        console.log(
          `Retrying connection in ${this.retryDelay / 1000} seconds...`,
        );
        await this.delay(this.retryDelay); // Wait before retrying
        return this.connectDB(retries + 1); // Retry connection
      } else {
        console.error('Max retries reached. Exiting...');
        process.exit(1); // Exit if maximum retries are reached
      }
    }
  }

  // private async loadModels() {
  //   const modelsPath = path.join(__dirname, '../models');
  //   console.log('Looking for models in:', modelsPath);

  //   try {
  //     const modelFiles = readdirSync(modelsPath);
  //     for (const file of modelFiles) {
  //       if (file.endsWith('.ts')) {
  //         const model = await import(path.join(modelsPath, file));
  //         console.log(`Loaded model: ${model.default.modelName}`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error loading models:', error);
  //   }
  // }
}

const db = new Database('../models');
export default db;
