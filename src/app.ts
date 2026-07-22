import { MongoDatabase} from './infrastructure/database/mongodb/connection.js'
import { envs } from './config/plugins/index.js'

async function main(): Promise<void> {
  try {
    await MongoDatabase.connect({
      mongodbUrl: envs.MONGO_URL,
      databaseName: envs.MONGO_DB_NAME,
      serverSelectionTimeoutMs: 5000
    })

    console.log( "GameVault initialized." )
  } catch (error) {
    console.log('Error initializing GameVault:', error)
  } finally {
    await MongoDatabase.disconnect()
  }
}

main()