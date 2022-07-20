import type { ComputedRef } from "./computed";
import type { Ref } from "./ref";
export declare type WatchEffect = (onInvalidate: InvalidateCbRegistrator) => void;
export declare type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T);
export declare type WatchCallback<V = any, OV = any> = (value: V, oldValue: OV, onInvalidate: InvalidateCbRegistrator) => any;
export declare type WatchStopHandle = () => void;
declare type MapSources<T> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? V : T[K] extends object ? T[K] : never;
};
declare type MapOldSources<T, Immediate> = {
    [K in keyof T]: T[K] extends WatchSource<infer V> ? Immediate extends true ? V | undefined : V : T[K] extends object ? Immediate extends true ? T[K] | undefined : T[K] : never;
};
declare type InvalidateCbRegistrator = (cb: () => void) => void;
export interface WatchOptionsBase {
    /**
     * @depreacted ignored in `@vue-reactivity/watch` and will always be `sync`
     */
    flush?: "sync" | "pre" | "post";
}
export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
    immediate?: Immediate;
    deep?: boolean;
}
export declare function watchEffect(effect: WatchEffect, options?: WatchOptionsBase): WatchStopHandle;
export declare function watch<T extends Readonly<Array<WatchSource<unknown> | object>>, Immediate extends Readonly<boolean> = false>(sources: T, cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>, options?: WatchOptions<Immediate>): WatchStopHandle;
export declare function watch<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate>): WatchStopHandle;
export declare function watch<T extends object, Immediate extends Readonly<boolean> = false>(source: T, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options?: WatchOptions<Immediate>): WatchStopHandle;
export {};
