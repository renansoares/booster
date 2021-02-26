import { Event, EventHandler } from './decorators'
import { Register, UUID } from '@boostercloud/framework-types'

@Event
export class BoosterAppDeployed {
  public constructor(readonly id: UUID) {}

  public entityID(): UUID {
    return this.id
  }
}

@EventHandler(BoosterAppDeployed)
export class HandleReadModelFillOperation {
  public static async handle(event: BoosterAppDeployed, register: Register): Promise<void> {
    console.log('////// READ MODEL FILLER //////')
    console.log(event)
    console.log(register)
  }
}
