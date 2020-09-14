import { BoosterConfig, Logger, ReadModelInterface } from '@boostercloud/framework-types'
import { stub, fake } from 'sinon'
import { ReadModelRegistry } from '../../src/services'
import { fetchReadModel, storeReadModel } from '../../src/library/read-model-adapter'
import { random } from 'faker'
import { expect } from '../expect'

describe('read-model-adapter', () => {
  let mockConfig: BoosterConfig
  let mockLogger: Logger
  const readModelName = 'ExampleReadModel'
  const readModelID = random.uuid()
  const readModelInterfaceResult = {
    id: readModelID,
    first: random.word(),
    second: random.word(),
    third: random.word(),
  } as ReadModelInterface
  const readModelRegistry = new ReadModelRegistry()

  beforeEach(() => {
    mockConfig = new BoosterConfig('test')
    mockConfig.appName = 'wow-wink'

    mockLogger = {
      info: fake(),
      error: fake(),
      debug: stub(),
    }
  })

  const mockReadModelInterface = (): Promise<ReadModelInterface> => {
    return new Promise((resolve) => {
      resolve(readModelInterfaceResult)
    })
  }

  describe('fetchReadModel', () => {
    it('calls the read model registry based on read model ID', async () => {
      const fetchById = stub(ReadModelRegistry.prototype, 'fetchById').returns(mockReadModelInterface())

      const result = await fetchReadModel(readModelRegistry, mockConfig, mockLogger, readModelName, readModelID)

      expect(result).to.be.equal(readModelInterfaceResult)
      expect(fetchById).to.have.been.calledOnceWithExactly(readModelName, readModelID)
      expect(mockLogger.debug).to.have.been.calledOnceWithExactly(
        `[ReadModelAdapter#fetchReadModel] Loaded read model ${readModelName} with ID ${readModelID} with result:`,
        readModelInterfaceResult
      )
    })
  })

  describe('store', () => {
    it('calls store method from read model registry', async () => {
      const store = stub(ReadModelRegistry.prototype, 'store').returnsThis()

      await storeReadModel(readModelRegistry, mockConfig, mockLogger, readModelName, readModelInterfaceResult)
      expect(store).to.have.been.calledOnceWithExactly({ typeName: readModelName, value: readModelInterfaceResult })
      expect(mockLogger.debug).to.have.been.calledOnceWithExactly('[ReadModelAdapter#storeReadModel] Read model stored')
    })
  })
})
