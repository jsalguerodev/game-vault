import { MongoDatabase } from './infrastructure/database/mongodb/connection.js'
import { envs } from './config/plugins/index.js'
import {
  AddPlatform,
  ListPlatforms,
  UpdatePlatform,
} from './application/use-cases/index.js'
import { PlatformModel } from './infrastructure/database/mongodb/models/index.js'
import { MongoPlatformRepository } from './infrastructure/repositories/index.js'

async function main(): Promise<void> {
  const platformRepository = new MongoPlatformRepository(PlatformModel)

  try {
    await MongoDatabase.connect({
      mongodbUrl: envs.MONGO_URL,
      databaseName: envs.MONGO_DB_NAME,
      serverSelectionTimeoutMs: 5000,
    })

    const addPlatform = new AddPlatform(platformRepository)
    const listPlatforms = new ListPlatforms(platformRepository)
    const updatePlatform = new UpdatePlatform(platformRepository)

    const platforms = await listPlatforms.execute()
    console.log(platforms)

    console.log('GameVault initialized.')
  } catch (error) {
    if (error instanceof Error)
      console.log('Error initializing GameVault: ', error.message)
  } finally {
    await MongoDatabase.disconnect()
  }
}

main()
