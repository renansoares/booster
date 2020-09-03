import { Booster } from '../booster'
import { Class, CommandInterface, RoleAccess, Register, BoosterConfig } from '@boostercloud/framework-types'
import { getPropertiesMetadata, getReturnTypeMetadata } from './metadata'

/**
 * Decorator to tell Booster which classes are your commands
 * @param attributes
 * @constructor
 */
export function Command(attributes: RoleAccess): <TCommand>(commandClass: CommandInterface<TCommand>) => void {
  return (commandClass) => {
    Booster.configureCurrentEnv((config): void => {
      if (config.commandAttributes[commandClass.name]) {
        throw new Error(`A command called ${commandClass.name} is already registered.
        If you think that this is an error, try performing a clean build.`)
      }
      config.commandAttributes[commandClass.name] = attributes
    })
  }
}

/**
 * Decorator to tell Booster which method is in charge of handling the command
 */
export function CommandHandler<TResult>(
  commandClass: Class<CommandInterface>,
  methodName: string,
  methodDescriptor: CommandHandlerMethod<CommandInterface, TResult>
): void {
  const method = methodDescriptor as Class<unknown>
  Booster.configureCurrentEnv((config): void => {
    assertCommandIsRegistered(config, commandClass)
    config.commandHandlers[commandClass.name] = {
      class: commandClass,
      properties: getPropertiesMetadata(method),
      returnType: getReturnTypeMetadata(method),
    }
  })
}

function assertCommandIsRegistered(config: BoosterConfig, commandClass: Class<CommandInterface>) {
  if (!config.commandAttributes[commandClass.name]) {
    throw new Error(`No command named ${commandClass.name} was registered.
Fix this by decorating the class acting as a command with the @Command decorator and specify the roles
authorized to execute it.

Example:

@Command({
  authorize: 'all'
})
export class My Command {
  ...
`)
  }
}

type CommandHandlerMethod<TCommand, TResult> = TypedPropertyDescriptor<(_: TCommand, register: Register) => TResult>
