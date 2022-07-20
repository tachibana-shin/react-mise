import { isFunction, NOOP } from "@vue/shared"

import type { Dep } from "./dep"
import { ReactiveEffect } from "./effect"
import { ReactiveFlags, toRaw } from "./reactive"
import type { Ref } from "./ref"
import { trackRefValue, triggerRefValue } from "./ref"

declare const ComputedRefSymbol: unique symbol

// eslint-disable-next-line no-use-before-define
export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T
  [ComputedRefSymbol]: true
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = (...args: any[]) => T;
export type ComputedSetter<T> = (v: T) => void;

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

export class ComputedRefImpl<T> {
  public dep?: Dep = undefined

  private _value!: T
  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true
  public readonly [ReactiveFlags.IS_READONLY]: boolean = false

  public _dirty = true
  public _cacheable: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    trackRefValue(self)
    if (self._dirty || !self._cacheable) {
      // eslint-disable-next-line functional/immutable-data
      self._dirty = false
      // eslint-disable-next-line functional/immutable-data
      self._value = self.effect.run()!
    }
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
// eslint-disable-next-line no-redeclare
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>;
// eslint-disable-next-line no-redeclare
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  isSSR = false
) {
  // eslint-disable-next-line functional/no-let
  let getter: ComputedGetter<T>
  // eslint-disable-next-line functional/no-let
  let setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions as typeof getter
    setter = NOOP
  } else {
    getter = (getterOrOptions as any).get
    setter = (getterOrOptions as any).set
  }

  const cRef = new ComputedRefImpl(
    getter,
    setter,
    onlyGetter || !setter,
    isSSR
  )

  return cRef as any
}
