import mongoose from 'mongoose'

const uri = process.env.MONGO_URL
if (!uri) {
  throw new Error('MONGO_URL is missing from env')
}

const dbConfig: {
  uri: string
  options: mongoose.ConnectOptions
} = {
  uri,
  options: {},
}

export class Database {
  public mongooseInstance: typeof mongoose | null = null

  constructor(
    private readonly maxRetries = 5,
    private readonly retryDelay = 5000,
  ) {
    if (!this.mongooseInstance) {
      this.connectDB().then(() => {
        console.info('Database Connected')
      })
    }
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async connectDB(retries = 0): Promise<typeof mongoose | null> {
    if (this.mongooseInstance) return this.mongooseInstance

    try {
      this.mongooseInstance = await mongoose.connect(
        dbConfig.uri,
        dbConfig.options,
      )
      return this.mongooseInstance
    } catch (error) {
      console.error(`MongoDB connection error (attempt ${retries + 1}):`, error)

      if (retries < this.maxRetries) {
        console.info(
          `Retrying connection in ${this.retryDelay / 1000} seconds...`,
        )
        await this.delay(this.retryDelay) // Wait before retrying
        return this.connectDB(retries + 1) // Retry connection
      } else {
        console.error('Max retries reached. Exiting...')
        process.exit(1)
      }
    }
  }

  static getInstance(): Database {
    return new Database()
  }

  async reconnect() {
    if (this.mongooseInstance) {
      await this.mongooseInstance.disconnect()
    }
    this.connectDB().then(() => console.info('Database Connected.'))
  }
}
