import * as DataStore from 'nedb'
import { ReadModelEnvelope, ReadModelInterface, UUID } from '@boostercloud/framework-types'
import { readModelDatabase } from '../paths'

export class ReadModelRegistry {
  private readonly readModels: Record<string, DataStore<ReadModelEnvelope>> = {}

  public async fetchById(readModelName: string, readModelID: UUID): Promise<ReadModelInterface> {
    const queryPromise = await new Promise((resolve, reject) => {
      this.getDataStoreFor(readModelName).find({ 'value.id': readModelID }, (err, elem) => {
        err ? reject(err) : resolve(elem)
      })
    })
    return queryPromise as ReadModelInterface
  }

  public store(readModel: ReadModelEnvelope): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getDataStoreFor(readModel.typeName).insert(readModel, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

  private getDataStoreFor(readModelName: string): DataStore<ReadModelEnvelope> {
    if (!this.readModels[readModelName]) {
      this.readModels[readModelName] = new DataStore(readModelDatabase(readModelName))
      this.readModels[readModelName].loadDatabase()
    }
    return this.readModels[readModelName]
  }
}
