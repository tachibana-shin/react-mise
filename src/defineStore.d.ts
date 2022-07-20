import type { DeepReadonly, UnwrapNestedRefs } from "./reactivity/reactive";
declare type FlatGetters<Getters = {}> = {
    readonly [Name in keyof Getters]: ReturnType<Getters[Name]>;
};
export interface OptionsStore<State, Actions, Getters, ReadonlyState> {
    state: () => State;
    actions?: Actions & ThisType<State & Actions & FlatGetters<Getters>>;
    getters?: Getters & ThisType<State & Actions & FlatGetters<Getters>>;
    readonly?: ReadonlyState;
}
export declare type UsedStore<State, Actions, Getters, ReadonlyState extends boolean> = [
    (ReadonlyState extends true ? DeepReadonly<UnwrapNestedRefs<State>> : UnwrapNestedRefs<State>) & Actions & FlatGetters<Getters>,
    Actions & ThisType<State & Actions & FlatGetters<Getters>>
];
export declare function defineStore<State extends Record<string, unknown>, Actions = {}, Getters extends Record<string, (state: UnwrapNestedRefs<State> & Actions & FlatGetters<Getters>) => any> = {}, ReadonlyState extends boolean = false>(options: OptionsStore<State, Actions, Getters, ReadonlyState>): () => UsedStore<State, Actions, Getters, ReadonlyState>;
export {};
