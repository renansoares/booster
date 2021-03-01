import { EntityMetadata, Register, UUID } from '@boostercloud/framework-types'
import { Event, EventHandler, Entity, Reduces } from '../decorators'
import { Booster } from '../booster'

@Event
export class BoosterAppDeployed {
  public constructor(readonly id: UUID) {}

  public entityID(): UUID {
    return this.id
  }
}

@EventHandler(BoosterAppDeployed)
export class BoosterHandleReadModelFillOperation {
  public static async handle(event: BoosterAppDeployed, register: Register): Promise<void> {
    const config = Booster.config
    Booster.config.entities.forEach((entityName: string, metadata: EntityMetadata) => {

    })
    for (const entity in Booster.config.entities) {
      const uniqueEntityIDs = config.provider.events.getUniqueIDs(entity) as Array<UUID>

      uniqueEntityIDs.map((id: string) => {
        Booster.fetchEntitySnapshot(entity, id)
      })
    }

    console.log('////// READ MODEL FILLER //////')
    console.log(event)
    console.log(register)
  }
}

@Entity
export class BoosterPostDeploy {
  public constructor(readonly id: UUID) {}

  @Reduces(BoosterAppDeployed)
  public static boosterAppWasDeployed(event: BoosterAppDeployed): BoosterPostDeploy {
    return new BoosterPostDeploy(event.id)
  }
}
