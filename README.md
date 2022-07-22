<p align="center">
  <a href="https://react-mise.js.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="./docs/public/react-mise.png" alt="React Mise logo">
  </a>
</p>


[![Build](https://github.com/tachibana-shin/react-mise/actions/workflows/test.yml/badge.svg)](https://github.com/tachibana-shin/react-mise/actions/workflows/test.yml)
[![NPM](https://badge.fury.io/js/react-mise.svg)](http://badge.fury.io/js/react-mise)
[![Size](https://img.shields.io/bundlephobia/minzip/react-mise/latest)](https://npmjs.org/package/react-mise)
[![Languages](https://img.shields.io/github/languages/top/tachibana-shin/react-mise)](https://npmjs.org/package/react-mise)
[![License](https://img.shields.io/npm/l/react-mise)](https://npmjs.org/package/react-mise)
[![Star](https://img.shields.io/github/stars/tachibana-shin/react-mise)](https://github.com/tachibana-shin/react-mise/stargazers)
[![Download](https://img.shields.io/npm/dm/react-mise)](https://npmjs.org/package/react-mise)

# React Mise

> Intuitive, type safe and flexible Store for React


- 💡 Intuitive
- 🔑 Type Safe
- 🔌 Extensible
- 🏗 Modular by design
- 📦 Extremely light

React Mise works both for React ^12

Mise (`kanji: 店`) pronounced mi'se which means store in Japanese. combined `React Mise` means the store for React.


## 👉 [Demo with React on StackBlitz](https://stackblitz.com/edit/react-mise-example-vite)


## Help me keep working on this project 💚

- [Follow on GitHub](https://github.com/tachibana-shin)
- [Follow on Twitter](https://twitter.com/tachib_shin)


---

## FAQ

A few notes about the project and possible questions:

**Q**: _Is React Mise the successor of Redux?_

**A**: [Yes](https://react-mise.js.org/guide/scaling-up/state-management.html#react-mise)

**Q**: _What about dynamic modules?_

**A**: Dynamic modules are not type safe, so instead [we allow creating different stores](https://react-mise.js.org/cookbook/composing-stores.html) that can be imported anywhere

## Roadmap / Ideas

- [x] Should the state be merged at the same level as actions and getters?
- [x] You can directly call `useOtherStore()` inside of a getter or action.
- [ ] ~~Getter with params that act like computed properties ~~ Can be implement through a custom composable and passed directly to state.

## Installation

```bash
yarn add react-mise
# or with npm
npm install react-mise
# or with pnpm
pnpm add react-mise
```

## Usage

### Install the plugin

No need for global object. you don't need something like `Provider` like `Redux` or `React hooks`. it makes the application silly when you need to use multiple stores for 1 component.

### Create a Store

You can create as many stores as you want, and they should each exist in different files:

```ts
import { defineStore } from "react-mise"

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useMainStore = defineStore("main", {
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  getters: {
    // getters receive the state as first parameter
    doubleCount: (state) => state.counter * 2,
    // use getters in other getters
    doubleCountPlusOne(): number {
      return this.doubleCount + 1
    },
  },
  // optional actions
  actions: {
    increment() {
      this.counter++
    },
    reset() {
      // `this` is the store instance
      this.counter = 0
    },
  },
})
```

`defineStore` returns a function that has to be called to get access to the store (in component):

```ts
import { useMainStore } from "src/stores/main"

export default function App() {
  const [mainStore] = useMainStore()

  return (
    <>
      Counter: {mainStore.counter} <br />
      Double counter: {mainStore.double} <br />

      <button onClick={counterStore.increment}>counter++</button>
      <button onClick={counterStore.reset>reset</button>
    </>
  )
}
```

`useStore` without in component:

```ts
import { useMainStore } from "src/stores/main"

const mainStore = ussMainStore(true)
```

`watch` store

```ts
import { useMainStore } from "src/stores/main"

const mainStore = ussMainStore(true)

watch(mainStore, () => console.log("main store changed"), { deep: true })
```

## Documentation

To learn more about React Mise, check [its documentation](https://react-mise.js.org).

## License

[MIT](http://opensource.org/licenses/MIT)

[https://react-mise.js.org](https://react-mise.js.org)
