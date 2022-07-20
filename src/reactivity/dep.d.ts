import type { ReactiveEffect } from "./effect";
export declare type Dep = Set<ReactiveEffect> & TrackedMarkers;
/**
 * wasTracked and newTracked maintain the status for several levels of effect
 * tracking recursion. One bit per level is used to define whether the dependency
 * was/is tracked.
 */
interface TrackedMarkers {
    /**
     * wasTracked
     */
    w: number;
    /**
     * newTracked
     */
    n: number;
}
export declare const createDep: (effects?: ReactiveEffect[]) => Dep;
export declare const wasTracked: (dep: Dep) => boolean;
export declare const newTracked: (dep: Dep) => boolean;
export declare const initDepMarkers: ({ deps }: ReactiveEffect) => void;
export declare const finalizeDepMarkers: (effect: ReactiveEffect) => void;
export {};
