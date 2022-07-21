# State

The state is, most of the time, the central part of your store. People often start by defining the state that represents their app. In React Mise the state is defined as a function that returns the initial state. This allows React Mise to work in both Server and Client Side.

```js
import { defineStore } from "react-mise"

const useStore = defineStore("storeId", {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      counter: 0,
      name: "Eduardo",
      isAdmin: true
    }
  }
})
```

## Accessing the `state`

By default, you can directly read and write to the state by accessing it through the `store` instance:

```js
const [store] = useStore()

store.counter++
```

### Usage with the Options API

For the following examples, you can assume the following store was created:

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from "react-mise"

const useCounterStore = defineStore("counterStore", {
  state: () => ({
    counter: 0
  })
})
```

## Mutating the state

<!-- TODO: disable this with `strictMode` -->

Apart from directly mutating the store with `store.counter++`, you can also call the `Object.assign` method. It allows you to apply multiple changes at the same time with a partial `state` object:

```js
Object.assign(store, {
  counter: store.counter + 1,
  age: 120,
  name: "DIO"
})
```

## Watch to the state

You can watch the state and its changes through the `watch` method of a store, similar to Vue [watch](https://vuejs.org/guide/essentials/watchers.html).

```js
watchEffect(() => {
  // persist the whole state to the local storage whenever it changes
  localStorage.setItem("cart", JSON.stringify(store))
})
```

:::tip
You can watch the whole state on the `react-mise` instance:

```js
watch(
  store,
  (state) => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem("react-miseState", JSON.stringify(state))
  },
  { deep: true }
)
```

:::
