import { Booster } from '../booster'
import { Class, CommandInterface, RoleAccess, Register } from '@boostercloud/framework-types'
import { getReturnTypeMetadata, getParametersMetadata } from './metadata'

/**
 * Decorator to tell Booster which classes are your commands
 * @param attributes
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
  commandClass: CommandInterface,
  _methodName: string,
  methodDescriptor: CommandHandlerMethod<TResult>
): void {
  const method = methodDescriptor as Class<unknown>
  Booster.configureCurrentEnv((config): void => {
    config.commandHandlers[commandClass.name] = {
      class: commandClass,
      properties: getParametersMetadata(method),
      returnType: getReturnTypeMetadata(method),
    }
  })
}

// TL;DR: Allowing `any` here because `TypedPropertyDescriptor` is very
// exquisite regarding the type of the function, and we cannot use `unknown`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CommandHandlerMethod<TResult> = TypedPropertyDescriptor<(command: any, register: Register) => Promise<TResult>>
