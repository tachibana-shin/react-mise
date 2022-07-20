import type { Dep } from "./dep";
import { ReactiveEffect } from "./effect";
import { ReactiveFlags } from "./reactive";
import type { Ref } from "./ref";
declare const ComputedRefSymbol: unique symbol;
export interface ComputedRef<T = any> extends WritableComputedRef<T> {
    readonly value: T;
    [ComputedRefSymbol]: true;
}
export interface WritableComputedRef<T> extends Ref<T> {
    readonly effect: ReactiveEffect<T>;
}
export declare type ComputedGetter<T> = (...args: any[]) => T;
export declare type ComputedSetter<T> = (v: T) => void;
export interface WritableComputedOptions<T> {
    get: ComputedGetter<T>;
    set: ComputedSetter<T>;
}
export declare class ComputedRefImpl<T> {
    private readonly _setter;
    dep?: Dep;
    private _value;
    readonly effect: ReactiveEffect<T>;
    readonly __v_isRef = true;
    readonly [ReactiveFlags.IS_READONLY]: boolean;
    _dirty: boolean;
    _cacheable: boolean;
    constructor(getter: ComputedGetter<T>, _setter: ComputedSetter<T>, isReadonly: boolean, isSSR: boolean);
    get value(): T;
    set value(newValue: T);
}
export declare function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>;
export declare function computed<T>(options: WritableComputedOptions<T>): WritableComputedRef<T>;
export {};
