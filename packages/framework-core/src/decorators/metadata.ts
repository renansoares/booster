import { ReturnTypeMetadata, PropertyMetadata, Class, AnyClass } from '@boostercloud/framework-types'
import 'reflect-metadata'

export function getPropertiesMetadata(classType: Class<unknown>): Array<PropertyMetadata> {
  const propertyNames = Object.getOwnPropertyNames(new classType())
  const propertyTypes = Reflect.getMetadata('design:paramtypes', classType)
  if (propertyNames.length != propertyTypes.length) {
    // eslint-disable-next-line prettier/prettier
    throw new Error(`Could not get proper metadata information of ${
      classType.name
    }. While inspecting the class, the following properties were found:
> ${propertyNames.join(', ')}
But its constructor parameters have the following types:
> ${propertyTypes.map((type: AnyClass) => type.name).join(', ')}
They mismatch. Make sure you define all properties as "constructor parameter properties" (see https://www.typescriptlang.org/docs/handbook/classes.html#parameter-properties)
`)
  }

  return propertyNames.map((propertyName, index) => ({
    name: propertyName,
    type: propertyTypes[index],
  }))
}

/**
 * Extracts the return type metadata from the TypeScript decorator metadata `design:returntype` key
 */
export function getParametersMetadata(method: Class<unknown>): Array<PropertyMetadata> {
  return Reflect.getMetadata('design:paramtypes', method)
}

/**
 * Extracts the return type metadata from the TypeScript decorator metadata `design:returntype` key
 */
export function getReturnTypeMetadata(method: Class<unknown>): ReturnTypeMetadata {
  const result = Reflect.getMetadata('design:returntype', method)
  if (!result) {
    console.error(method)
    throw Error('Metadata arrived empty')
  }
  return result
}
