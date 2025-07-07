// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MaybePromise<T> = T extends Promise<any> ? T : T | Promise<T>;
