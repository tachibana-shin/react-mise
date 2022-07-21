# Defining a Store

Before diving into core concepts, we need to know that a store is defined using `defineStore()` and that it requires a **unique** name, passed as the first argument:

```js
import { defineStore } from "react-mise"

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore("main", {
  // other options...
})
```

This _name_, also referred as _id_, is necessary and is used by React Mise to connect the store to the devtools. Naming the returned function _use..._ is a convention across composables to make its usage idiomatic.

## Using the store

We are _defining_ a store because the store won't be created until `useStore()` is called inside of `setup()`:

```js
export default function () {
  const [store] = useStore()

  // you can return the whole store instance to use it in the template
}
```

You can define as many stores as you want and **you should define each store in a different file** to get the most out of react-mise (like automatically allow your bundle to code split and TypeScript inference).

Once the store is instantiated, you can access any property defined in `state`, `getters`, and `actions` directly on the store. We will see these in detail in the next pages but autocompletion will help you.

```js
export default function () {
  const [store] = useStore()

  // ❌ This won't work because it breaks reactivity
  // it's the same as destructuring from `props`
  const { name, doubleCount } = store

  name // "eduardo"
  doubleCount // 2
}
```
