# Using a store outside of a component

React Mise stores rely on the `react-mise` instance to share the same store instance across all calls. Most of the time, this works out of the box by just calling your `useStore()` function. For example, in `component`, you don't need to do anything else. But things are a bit different outside of a component.
Behind the scenes, `useStore()` _injects_ the `react-mise` instance you gave to your `app`. This means that if the `react-mise` instance cannot be automatically injected, you have to manually provide it to the `useStore()` function.
You can solve this differently depending on the kind of application you are writing.

## Single Page Applications

The easiest way to ensure this is always applied is to _defer_ calls of `useStore()` by placing them inside functions that will always run after react-mise is installed.

Let's take a look at this example of using a store inside of a navigation guard with Vue Router:

```js
// ❌ Depending on the order of imports this will fail
const store = useStore()

router.beforeEach((to, from, next) => {
  // we wanted to use the store here
  if (store.isLoggedIn) next()
  else next("/login")
})

// ✅ This will work because the router starts with used
// the router is installed and react-mise will be installed too
const store = useStore(true)
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !store.isLoggedIn) return "/login"
})
```

## SSR Apps

When dealing with Server Side Rendering, you will have to pass the `react-mise` instance to `useStore()`. This prevents react-mise from sharing global state between different application instances.
