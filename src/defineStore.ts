import {
  useEffect,
  useId,
  useState,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
} from "react"

import { computed } from "./reactivity/computed"
import {
  cleanupEffect,
  effectNotActived,
  ReactiveEffect
} from "./reactivity/effect"
import type { DeepReadonly, UnwrapNestedRefs } from "./reactivity/reactive"
import { reactive } from "./reactivity/reactive"

// eslint-disable-next-line @typescript-eslint/ban-types
type FlatGetters<Getters = {}> = {
  readonly // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  [Name in keyof Getters]: ReturnType<Getters[Name]>
}

export interface OptionsStore<State, Actions, Getters, ReadonlyState> {
  id?: string
  state?: () => State
  actions?: Actions & ThisType<State & Actions & FlatGetters<Getters>>
  getters?: Getters & ThisType<State & Actions & FlatGetters<Getters>>
  readonly?: ReadonlyState
}

export type UsedStore<
  State,
  Actions,
  Getters,
  ReadonlyState extends boolean
> = [
  (ReadonlyState extends true
    ? DeepReadonly<UnwrapNestedRefs<State>>
    : UnwrapNestedRefs<State>) &
    Actions &
    FlatGetters<Getters>,
  Actions & ThisType<State & Actions & FlatGetters<Getters>>
]

const randomUUID = (): string => {
  return Math.random().toString(36).slice(2, 9)
}

function defineStore<
  // eslint-disable-next-line @typescript-eslint/ban-types
  State extends Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  Actions = {},
  Getters extends Record<
    string,
    (
      state: UnwrapNestedRefs<State> & Actions & FlatGetters<Getters>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any
    // eslint-disable-next-line @typescript-eslint/ban-types
  > = {},
  ReadonlyState extends boolean = false
>(
  id: string,
  options: OptionsStore<State, Actions, Getters, ReadonlyState>
): () => UsedStore<State, Actions, Getters, ReadonlyState>
// eslint-disable-next-line no-redeclare
function defineStore<
  State extends Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  Actions = {},
  Getters extends Record<
    string,
    (
      state: UnwrapNestedRefs<State> & Actions & FlatGetters<Getters>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any
    // eslint-disable-next-line @typescript-eslint/ban-types
  > = {},
  ReadonlyState extends boolean = false
>(
  options: OptionsStore<State, Actions, Getters, ReadonlyState>
): () => UsedStore<State, Actions, Getters, ReadonlyState>

// eslint-disable-next-line no-redeclare
function defineStore<
  // eslint-disable-next-line @typescript-eslint/ban-types
  State extends Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/ban-types
  Actions = {},
  Getters extends Record<
    string,
    (
      state: UnwrapNestedRefs<State> & Actions & FlatGetters<Getters>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => any
    // eslint-disable-next-line @typescript-eslint/ban-types
  > = {},
  ReadonlyState extends boolean = false
>(
  id: string | OptionsStore<State, Actions, Getters, ReadonlyState>,
  options?: OptionsStore<State, Actions, Getters, ReadonlyState>
): (used?: boolean) => UsedStore<State, Actions, Getters, ReadonlyState> {
  if (!options) {
    options = id as Exclude<typeof id, string>
    id = options.id ?? randomUUID()
  }
  const { actions = {} as Actions } = options

  const state = reactive(options.state?.() ?? {}) as (ReadonlyState extends true
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

  return (used): UsedStore<State, Actions, Getters, ReadonlyState> => {
    try {
      if (used || effectNotActived(id as string)) return [state, actions]

      // eslint-disable-next-line @typescript-eslint/ban-types
      const [, setUnique] = useState(undefined as unknown as {})
      const effect = new ReactiveEffect(
        () => {
          setUnique({})
          cleanupEffect(effect)
          // eslint-disable-next-line functional/immutable-data
          effect.active = false
          effect.stop()
          // clear effect after call one fn
        },
        null,
        id as string
      )
      effect.record()
      useEffect(effect.end.bind(effect))
    } catch {}
    return [state, actions]
  }
}

export { defineStore }
