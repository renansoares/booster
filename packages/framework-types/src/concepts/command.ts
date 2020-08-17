import { Register } from './register'
import { PropertyMetadata, Class } from '../typelevel'
import { RoleAccess } from './role'
import { Class, PropertyMetadata, AnyClass } from '../typelevel'
import { Class, PropertyMetadata, ReturnTypeMetadata } from '../typelevel'

export interface CommandInterface<TCommand = unknown> extends Class<TCommand> {
  // The command's type is `unknown` because the CommandInterface type specifies the
  // structure of the class, rather than the instance of the commands, which is what
  // arrives to the `handle` static method.
  handle(command: TCommand, register: Register): Promise<void>
}

export interface CommandHandlerMetadata {
  readonly class: Class<CommandInterface>
  readonly properties: Array<PropertyMetadata>
  readonly returnType: ReturnTypeMetadata
}
