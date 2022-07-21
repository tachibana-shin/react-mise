# Actions

Actions are the equivalent of [methods](https://v3.vuejs.org/guide/data-methods.html#methods) in components. They can be defined with the `actions` property in `defineStore()` and **they are perfect to define business logic**:

```ts
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    }
  }
})
```

Like [getters](./getters.md), actions get access to the _whole store instance_ through `this` with **full typing (and autocompletion ✨) support**. **Unlike getters, `actions` can be asynchronous**, you can `await` inside of actions any API call or even other actions! Here is an example using [Mande](https://github.com/posva/mande). Note the library you use doesn't matter as long as you get a `Promise`, you could even use the native `fetch` function (browser only):

```ts
import { mande } from "mande"

const api = mande("/api/users")

export const useUsers = defineStore("users", {
  state: () => ({
    userData: <UserData | null>null
    // ...
  }),

  actions: {
    async registerUser(login: string, password: string) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // let the form component display the error
        return error
      }
    }
  }
})
```

You are also completely free to set whatever arguments you want and return anything. When calling actions, everything will be automatically inferred!

Actions are invoked like methods:

```ts
export default function App() {
  const [main] = useMainStore()
  // call the action as a method of the store
  main.randomizeCounter()
}
```

## Accessing other stores actions

To use another store, you can directly _use it_ inside of the _action_:

```ts
import { useAuthStore } from "./auth-store"

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    preferences: null
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const [auth] = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error("User must be authenticated")
      }
    }
  }
})
```

## Usage with `component`

You can directly call any action as a method of the store:

```js
export default function App() {
  const [store] = useStore()

  store.randomizeCounter()
}
```

or `without component`

```ts
const [store] = useStore(true)

store.randomizeCounter()
```
