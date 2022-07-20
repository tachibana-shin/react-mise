import { useEffect, useState } from "react"

import { computed } from "./reactivity/computed"
import { cleanupEffect, ReactiveEffect } from "./reactivity/effect"
import type {
  DeepReadonly,
  UnwrapNestedRefs
} from "./reactivity/reactive"
import {
  reactive
} from "./reactivity/reactive"

// eslint-disable-next-line @typescript-eslint/ban-types
type FlatGetters<Getters = {}> = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  readonly // @ts-expect-error
  [Name in keyof Getters]: ReturnType<Getters[Name]>;
};

export interface OptionsStore<State, Actions, Getters, ReadonlyState> {
  state: () => State
  actions?: Actions & ThisType<State & Actions & FlatGetters<Getters>>
  getters?: Getters & ThisType<State & Actions & FlatGetters<Getters>>
  readonly?: ReadonlyState
}

export type UsedStore<State, Actions, Getters, ReadonlyState extends boolean> = [
  (ReadonlyState extends true
    ? DeepReadonly<UnwrapNestedRefs<State>>
    : UnwrapNestedRefs<State>) &
    Actions &
    FlatGetters<Getters>,
  Actions & ThisType<State & Actions & FlatGetters<Getters>>
];

export function defineStore<
  State extends Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Actions = {},
  Getters extends Record<string, (
      state: UnwrapNestedRefs<State> & Actions & FlatGetters<Getters>
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    ) => any> = {},
  ReadonlyState extends boolean = false
>(
  options: OptionsStore<State, Actions, Getters, ReadonlyState>
): () => UsedStore<State, Actions, Getters, ReadonlyState> {
  const { actions = {} as Actions } = options

  const state = reactive(options.state()) as (ReadonlyState extends true
    ? DeepReadonly<UnwrapNestedRefs<State>>
    : UnwrapNestedRefs<State>) &
    Actions &
    FlatGetters<Getters>

  // ================= bind this to options.actions =============
  for (const name in actions) {
    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/ban-types
    actions[name] = (actions[name] as unknown as Function).bind(
      state
    ) as typeof actions[typeof name]
  }
  // ============================================================

  // re-bind actions
  Object.assign(
    state,
    actions,
    (options.getters &&
      // eslint-disable-next-line n/no-unsupported-features/es-builtins
      Object.fromEntries(
        Object.entries(options.getters).map(([name, getter]) => [
          name,
          computed(() =>
            getter.call(
              state,
              state as UnwrapNestedRefs<State> & Actions & FlatGetters<Getters>
            )
          )
        ])
      )) as FlatGetters<Getters>
  )

  return (): UsedStore<State, Actions, Getters, ReadonlyState> => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const [, setUnique] = useState(undefined as unknown as {})
    const effect = new ReactiveEffect(() => {
      setUnique({})
      console.log("force update")
      cleanupEffect(effect)
      // eslint-disable-next-line functional/immutable-data
      effect.active = false
      effect.stop()
      // clear effect after call one fn
    })
    effect.record()
    useEffect(effect.end.bind(effect))

    return [state, actions]
  }
}
