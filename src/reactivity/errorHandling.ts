import { isFunction, isPromise } from "./shared"

export function callWithErrorHandling(
  fn: Function,
  type: string,
  args?: unknown[]
) {
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch {}
  return res
}

export function callWithAsyncErrorHandling(
  fn: Function | Function[],
  type: string,
  args?: unknown[]
): any[] {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, type, args)
    if (res && isPromise(res)) {
      res.catch(() => {})
    }
    return res
  }

  const values = []
  for (let i = 0; i < fn.length; i++)
    values.push(callWithAsyncErrorHandling(fn[i], type, args))

  return values
}
