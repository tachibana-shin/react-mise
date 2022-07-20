import type { ComputedRefImpl } from "./computed";
import type { Dep } from "./dep";
import type { TrackOpTypes } from "./operations";
import { TriggerOpTypes } from "./operations";
export declare let trackOpBit: number;
export declare type EffectScheduler = (...args: any[]) => any;
export declare type DebuggerEvent = {
    effect: ReactiveEffect;
} & DebuggerEventExtraInfo;
export interface DebuggerEventExtraInfo {
    target: object;
    type: TrackOpTypes | TriggerOpTypes;
    key: any;
    newValue?: any;
    oldValue?: any;
    oldTarget?: Map<any, any> | Set<any>;
}
export declare let activeEffect: ReactiveEffect | undefined;
export declare const ITERATE_KEY: unique symbol;
export declare const MAP_KEY_ITERATE_KEY: unique symbol;
export declare class ReactiveEffect<T = any> {
    fn: (() => T) | null;
    scheduler: EffectScheduler | null;
    active: boolean;
    deps: Dep[];
    parent: ReactiveEffect | undefined;
    /**
     * Can be attached after creation
     * @internal
     */
    computed?: ComputedRefImpl<T>;
    /**
     * @internal
     */
    allowRecurse?: boolean;
    /**
     * @internal
     */
    private deferStop?;
    private lastShouldTracks;
    onStop?: () => void;
    constructor(fn?: (() => T) | null, scheduler?: EffectScheduler | null);
    record(): boolean | undefined;
    end(): void;
    run(): T | undefined;
    stop(): void;
}
export declare function cleanupEffect(effect: ReactiveEffect): void;
export interface ReactiveEffectOptions {
    lazy?: boolean;
    scheduler?: EffectScheduler;
    allowRecurse?: boolean;
    onStop?: () => void;
}
export interface ReactiveEffectRunner<T = any> {
    (): T;
    effect: ReactiveEffect;
}
export declare function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions): ReactiveEffectRunner;
export declare function stop(runner: ReactiveEffectRunner): void;
export declare let shouldTrack: boolean;
export declare function pauseTracking(): void;
export declare function enableTracking(): void;
export declare function resetTracking(): void;
export declare function track(target: object, type: TrackOpTypes, key: unknown): void;
export declare function trackEffects(dep: Dep): void;
export declare function trigger(target: object, type: TriggerOpTypes, key?: unknown, newValue?: unknown, oldValue?: unknown, oldTarget?: Map<unknown, unknown> | Set<unknown>): void;
export declare function triggerEffects(dep: Dep | ReactiveEffect[]): void;
