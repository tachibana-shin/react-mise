import type { Target } from "./reactive";
export declare const mutableHandlers: ProxyHandler<object>;
export declare const readonlyHandlers: ProxyHandler<object>;
export declare const shallowReactiveHandlers: ProxyHandler<object> & {
    get: (target: Target, key: string | symbol, receiver: object) => any;
    set: (target: object, key: string | symbol, value: unknown, receiver: object) => boolean;
};
export declare const shallowReadonlyHandlers: ProxyHandler<object> & {
    get: (target: Target, key: string | symbol, receiver: object) => any;
};
