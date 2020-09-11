import { BoosterConfig, Logger, ReadModelInterface, UUID } from '@boostercloud/framework-types'
import { ReadModelRegistry } from '../services'

export async function fetchReadModel(
  readModelDB: ReadModelRegistry,
  config: BoosterConfig,
  logger: Logger,
  readModelName: string,
  readModelID: UUID
): Promise<ReadModelInterface> {
  const readModel = await readModelDB.fetchById(readModelName, readModelID)
  logger.debug(
    `[ReadModelAdapter#fetchReadModel] Loaded read model ${readModelName} with ID ${readModelID} with result:`,
    readModel
  )
  return readModel as ReadModelInterface
}

export async function storeReadModel(
  readModelDB: ReadModelRegistry,
  config: BoosterConfig,
  logger: Logger,
  readModelName: string,
  readModel: ReadModelInterface
): Promise<void> {
  await readModelDB.store({
    typeName: readModelName,
    value: readModel,
  })
  logger.debug('[ReadModelAdapter#storeReadModel] Read model stored')
}

// TODO: Provide the deleteReadModel function when merging BOOST-587
/*
export async function deleteReadModel(
  readModelDB: ReadModelRegistry,
  config: BoosterConfig,
  logger: Logger,
  readModelName: string,
  readModel: ReadModelInterface
): Promise<void> {

}
*/
