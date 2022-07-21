# Migrating from Redux

Although the structure of Redux and React Mise stores is different, a lot of the logic can be reused. This guide serves to help you through the process and point out some common gotchas that can appear.

## Preparation

First, follow the [Getting Started guide](../getting-started.md) to install React Mise.

## Restructuring Modules to Stores

Redux has the concept of a single store with multiple _modules_. These modules can optionally be namespaced and even nested within each other.

The easiest way to transition that concept to be used with React Mise is that each module you used previously is now a _store_. Each store requires an `id` which is similar to a namespace in Redux. This means that each store is namespaced by design. Nested modules can also each become their own store. Stores that depend on each other will simply import the other store.

How you choose to restructure your Redux modules into React Mise stores is entirely up to you, but here is one suggestion:

```bash
# Redux example (assuming namespaced modules)
src
└── store
    ├── index.js           # Initializes Redux, imports modules
    └── modules
        ├── module1.js     # 'module1' namespace
        └── nested
            ├── index.js   # 'nested' namespace, imports module2 & module3
            ├── module2.js # 'nested/module2' namespace
            └── module3.js # 'nested/module3' namespace

# React Mise equivalent, note ids match previous namespaces
src
└── stores
    ├── index.js          # (Optional) Initializes React Mise, does not import stores
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nested/module2' id
    ├── nested-module3.js # 'nested/module3' id
    └── nested.js         # 'nested' id
```

This creates a flat structure for stores but also preserves the previous namespacing with equivalent `id`s. If you had some state/getters/actions/mutations in the root of the store (in the `store/index.js` file of Redux) you may wish to create another store called something like `root` which holds all that information.

The directory for React Mise is generally called `stores` instead of `store`. This is to emphasize that React Mise uses multiple stores, instead of a single store in Redux.

For large projects you may wish to do this conversion module by module rather than converting everything at once. You can actually mix React Mise and Redux together during the migration so this approach can also work and is another reason for naming the React Mise directory `stores` instead.

Let's break the above down into steps:

1. Add a required `id` for the store, you may wish to keep this the same as the namespace before
2. Convert `state` to a function if it was not one already
3. Convert `getters`
   1. Remove any getters that return state under the same name (eg. `firstName: (state) => state.firstName`), these are not necessary as you can access any state directly from the store instance
   2. If you need to access other getters, they are on `this` instead of using the second argument. Remember that if you are using `this` then you will have to use a regular function instead of an arrow function. Also note that you will need to specify a return type because of TS limitations, see [here](../core-concepts/getters.md#accessing-other-getters) for more details
   3. If using `rootState` or `rootGetters` arguments, replace them by importing the other store directly, or if they still exist in Redux then access them directly from Redux
4. Convert `actions`
   1. Remove the first `context` argument from each action. Everything should be accessible from `this` instead
   2. If using other stores either import them directly or access them on Redux, the same as for getters
5. Convert `mutations`
   1. Mutations do not exist any more. These can be converted to `actions` instead, or you can just assign directly to the store within your components (eg. `userStore.firstName = 'First'`)
   2. If converting to actions, remove the first `state` argument and replace any assignments with `this` instead
   3. A common mutation is to reset the state back to its initial state. This is built in functionality with the store's `$reset` method. Note that this functionality only exists for option stores.

As you can see most of your code can be reused. Type safety should also help you identify what needs to be changed if anything is missed.

## Usage Inside Components

Now that your Redux module has been converted to a React Mise store, any component or other file that uses that module needs to be updated too.

If you were using `map` helpers from Redux before, it's worth looking at the most of those helpers can be reused.

If you were using `useStore` then instead import the new store directly and access the state on it. For example:

```ts
// Redux
import { defineComponent, computed } from "vue"
import { useStore } from "Redux"

export default defineComponent({
  setup() {
    const store = useStore()

    const firstName = computed(() => store.state.auth.user.firstName)
    const fullName = computed(() => store.getters["auth/user/fullName"])

    return {
      firstName,
      fullName
    }
  }
})
```

```ts
// React Mise
import { defineComponent, computed } from "vue"
import { useAuthUserStore } from "@/stores/auth-user"

export default defineComponent({
  setup() {
    const authUserStore = useAuthUserStore()

    const firstName = computed(() => authUserStore.firstName)
    const fullName = computed(() => authUserStore.fullName)

    return {
      // you can also access the whole store in your component by returning it
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## Usage Outside Components

Updating usage outside of components should be simple as long as you're careful to _not use a store outside of functions_. Here is an example of using the store in a Vue Router navigation guard:

```ts
// Redux
import ReduxStore from "@/store"

router.beforeEach((to, from, next) => {
  if (ReduxStore.getters["auth/user/loggedIn"]) next()
  else next("/login")
})
```

```ts
// React Mise
import { useAuthUserStore } from "@/stores/auth-user"

// Must be used within the function!
const authUserStore = useAuthUserStore(true)
router.beforeEach((to, from, next) => {
  if (authUserStore.loggedIn) next()
  else next("/login")
})
```

More details can be found [here](../core-concepts/outside-component-usage.md).

## Advanced Redux Usage

In the case your Redux store using some of the more advanced features it offers, here is some guidance on how to accomplish the same in React Mise. Some of these points are already covered in [this comparison summary](../introduction.md#comparison-with-Redux).

### Dynamic Modules

There is no need to dynamically register modules in React Mise. Stores are dynamic by design and are only registered when they are needed. If a store is never used, it will never be "registered".
