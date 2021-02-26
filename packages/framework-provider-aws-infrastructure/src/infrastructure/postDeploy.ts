import { BoosterConfig, Logger } from '@boostercloud/framework-types'
import { DynamoDB } from 'aws-sdk'

export async function postDeploy(config: BoosterConfig, logger: Logger): Promise<void> {
  const ddb = new DynamoDB.DocumentClient()
  // Insert BoosterAppDeployed into event-store
  const entityID = 11111
  const requestID = 'random_id'
  const entityTypeName = 'PostDeploy'
  const eventName = 'BoosterAppDeployed'
  const value = {} // What's passed to the event
  const params = {
    TableName: config.resourceNames.eventsStore,
    Item: {
      createdAt: new Date().toISOString(),
      entityID: entityID,
      entityTypeName: entityTypeName,
      // eslint-disable-next-line @typescript-eslint/camelcase
      entityTypeName_entityID_kind: `${entityTypeName}-${entityID}-event`,
      kind: 'event',
      requestID: requestID,
      typeName: eventName,
      value: value,
      version: 1,
    },
  }

  try {
    await ddb.put(params).promise()
  } catch (e) {
    logger.error('An error occurred while running your postDeploy actions: ', e)
  }
}
