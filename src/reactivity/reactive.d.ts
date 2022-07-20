import type { RawSymbol, Ref, UnwrapRefSimple } from "./ref";
export declare const enum ReactiveFlags {
    SKIP = "__v_skip",
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
    IS_SHALLOW = "__v_isShallow",
    RAW = "__v_raw"
}
export interface Target {
    [ReactiveFlags.SKIP]?: boolean;
    [ReactiveFlags.IS_REACTIVE]?: boolean;
    [ReactiveFlags.IS_READONLY]?: boolean;
    [ReactiveFlags.IS_SHALLOW]?: boolean;
    [ReactiveFlags.RAW]?: any;
}
export declare const reactiveMap: WeakMap<Target, any>;
export declare const shallowReactiveMap: WeakMap<Target, any>;
export declare const readonlyMap: WeakMap<Target, any>;
export declare const shallowReadonlyMap: WeakMap<Target, any>;
export declare type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRefSimple<T>;
/**
 * Creates a reactive copy of the original object.
 *
 * The reactive conversion is "deep"—it affects all nested properties. In the
 * ES2015 Proxy based implementation, the returned proxy is **not** equal to the
 * original object. It is recommended to work exclusively with the reactive
 * proxy and avoid relying on the original object.
 *
 * A reactive object also automatically unwraps refs contained in it, so you
 * don't need to use `.value` when accessing and mutating their value:
 *
 * ```js
 * const count = ref(0)
 * const obj = reactive({
 *   count
 * })
 *
 * obj.count++
 * obj.count // -> 1
 * count.value // -> 1
 * ```
 */
export declare function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;
export declare const ShallowReactiveMarker: unique symbol;
export declare type ShallowReactive<T> = T & {
    [ShallowReactiveMarker]?: true;
};
/**
 * Return a shallowly-reactive copy of the original object, where only the root
 * level properties are reactive. It also does not auto-unwrap refs (even at the
 * root level).
 */
export declare function shallowReactive<T extends object>(target: T): ShallowReactive<T>;
declare type Primitive = string | number | boolean | bigint | symbol | undefined | null;
declare type Builtin = Primitive | Function | Date | Error | RegExp;
export declare type DeepReadonly<T> = T extends Builtin ? T : T extends Map<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> : T extends WeakMap<infer K, infer V> ? WeakMap<DeepReadonly<K>, DeepReadonly<V>> : T extends Set<infer U> ? ReadonlySet<DeepReadonly<U>> : T extends ReadonlySet<infer U> ? ReadonlySet<DeepReadonly<U>> : T extends WeakSet<infer U> ? WeakSet<DeepReadonly<U>> : T extends Promise<infer U> ? Promise<DeepReadonly<U>> : T extends Ref<infer U> ? Readonly<Ref<DeepReadonly<U>>> : T extends {} ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : Readonly<T>;
/**
 * Creates a readonly copy of the original object. Note the returned copy is not
 * made reactive, but `readonly` can be called on an already reactive object.
 */
export declare function readonly<T extends object>(target: T): DeepReadonly<UnwrapNestedRefs<T>>;
/**
 * Returns a reactive-copy of the original object, where only the root level
 * properties are readonly, and does NOT unwrap refs nor recursively convert
 * returned properties.
 * This is used for creating the props proxy object for stateful components.
 */
export declare function shallowReadonly<T extends object>(target: T): Readonly<T>;
export declare function isReactive(value: unknown): boolean;
export declare function isReadonly(value: unknown): boolean;
export declare function isShallow(value: unknown): boolean;
export declare function isProxy(value: unknown): boolean;
export declare function toRaw<T>(observed: T): T;
export declare function markRaw<T extends object>(value: T): T & {
    [RawSymbol]?: true;
};
export declare const toReactive: <T extends unknown>(value: T) => T;
export declare const toReadonly: <T extends unknown>(value: T) => T;
export {};
