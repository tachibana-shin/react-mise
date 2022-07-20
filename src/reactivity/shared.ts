import { CollectionTypes } from "./collectionHandlers"

export const extend = Object.assign
export const hasChanged = (v1: unknown, v2: unknown) => !Object.is(v1, v2)
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: any, key: any) => hasOwnProperty.call(val, key)
export const isArray = Array.isArray
export const isIntegerKey = (key: unknown) =>
  typeof key === "string" &&
  key !== "NaN" &&
  key[0] !== "-" &&
  "" + parseInt(key, 10) === key
export const isSymbol = (val: any): val is symbol => typeof val === "symbol"
export const isObject = (
  val: any
): val is Record<string | number | symbol, unknown> =>
  val !== null && typeof val === "object"

export function makeMap(
  str: string,
  expectsLowerCase?: false
): (val: string | symbol | number) => boolean
export function makeMap(
  str: string,
  expectsLowerCase?: true
): (val: string) => boolean

export function makeMap(str: string, expectsLowerCase?: boolean) {
  const map = Object.create(null)
  const list = str.split(",")
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? (val: string) => !!map[val.toLowerCase()]
    : (val: string | symbol | number) => !!map[val]
}

const objectToString = Object.prototype.toString
const toTypeString = (value: any) => objectToString.call(value)
export const isMap = (val: any): val is Map<unknown, unknown> =>
  toTypeString(val) === "[object Map]"
export const toRawType = (value: any) => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}

export const isFunction = (val: any): val is Function =>
  typeof val === "function"
export const NOOP = () => {}

export const isPromise = (val: any): val is Promise<any> => {
  return (
    isObject(val) &&
    isFunction((val as unknown as any).then) &&
    isFunction((val as unknown as any).catch)
  )
}

export const def = (
  obj: object,
  key: string | number | symbol,
  value: boolean
) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}

export declare type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N
