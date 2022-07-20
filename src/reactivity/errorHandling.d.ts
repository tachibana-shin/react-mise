export declare function callWithErrorHandling(fn: Function, type: string, args?: unknown[]): any;
export declare function callWithAsyncErrorHandling(fn: Function | Function[], type: string, args?: unknown[]): any[];
export declare function handleError(err: unknown, type: string): void;
export declare function raise(message: string): never;
export declare function warn(message: string): void;
export declare function createError(message: string): Error;
