// FIXME: Remove this
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Booster } from '../booster'
import { Class, RoleMetadata, RoleInterface, AnyClass } from '@boostercloud/framework-types'

/**
 * Decorator to tell Booster information about the type of a field or
 * method. Useful when Booster is not capable of inferring it.
 */
export function Type<TType>(
  _typeInfo: TypeInfo<TType>
): (_class: AnyClass, propertyName: string, propertyDescriptor: TypedPropertyDescriptor<TypeInfoMatch<TType>>) => void {
  return (_role): void => {
    Booster.configureCurrentEnv((_config): void => {})
  }
}

type TypeInfo<TType> = Returns<TType> | ItemTypeInfo<TType>

type Returns<TType> = { returns: ItemTypeInfo<TType> }
type ItemTypeInfo<TType> = { arrayOf: ItemTypeInfo<TType> } | TType

type TypeInfoMatch<TType> = TType extends Returns<infer TChild>
  ? FunctionTypeInfo<TChild>
  : TType extends ItemTypeInfo<infer TChild>
  ? ItemTypeInfoMatch<TChild>
  : never

type FunctionTypeInfo<TType> =
  | ((...args: Array<unknown>) => Promise<ItemTypeInfoMatch<TType>>)
  | ((...args: Array<unknown>) => ItemTypeInfoMatch<TType>)

type ItemTypeInfoMatch<TType> = TType extends { arrayOf: ItemTypeInfo<infer TChild> }
  ? Array<ItemTypeInfoMatch<TChild>>
  : TType

/*
type Returns(type: ItemTypeInfo<T>)

data ItemTypeInfo<T> {
  ArrayOf(items: ItemTypeInfo<T>)
  UnionOf(types: Array<ItemTypeInfo<T>>)
  TypeInfo(t: T)
}
*/
