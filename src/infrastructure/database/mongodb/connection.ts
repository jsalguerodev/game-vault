import mongoose from "mongoose"
import { envs } from "../../../config/plugins/index.js"

interface ConnectionOptions {
  readonly mongodbUrl: string
  readonly databaseName: string
  readonly serverSelectionTimeoutMs: number
}

export class MongoDatabase {
  static async connect(options: ConnectionOptions): Promise<void> {
    const { mongodbUrl, databaseName, serverSelectionTimeoutMs } = options

    await mongoose.connect(mongodbUrl, {
      dbName: databaseName,
      serverSelectionTimeoutMS: serverSelectionTimeoutMs,
    })
  }

  static async disconnect(): Promise<void> {
    await mongoose.disconnect()
  }
}