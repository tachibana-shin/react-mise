<p align="center">
  <a href="https://shin.is-a.dev/react-mise" target="_blank" rel="noopener noreferrer">
    <img width="180" src="./react-mise.png" alt="React Mise logo">
  </a>
</p>

# React Mise

> Intuitive, type safe and flexible Store for React


[![Build](https://github.com/tachibana-shin/react-mise/actions/workflows/build-docs.yml/badge.svg)](https://github.com/tachibana-shin/react-mise/actions/workflows/docs.yml)
[![NPM](https://badge.fury.io/js/react-mise.svg)](http://badge.fury.io/js/react-mise)
[![Size](https://img.shields.io/bundlephobia/minzip/react-mise/latest)](https://npmjs.org/package/react-mise)
[![Languages](https://img.shields.io/github/languages/top/tachibana-shin/react-mise)](https://npmjs.org/package/react-mise)
[![License](https://img.shields.io/npm/l/react-mise)](https://npmjs.org/package/react-mise)
[![Star](https://img.shields.io/github/stars/tachibana-shin/react-mise)](https://github.com/tachibana-shin/react-mise/stargazers)
[![Download](https://img.shields.io/npm/dm/react-mise)](https://npmjs.org/package/react-mise)


## 👉 [Demo with React on StackBlitz](https://stackblitz.com/edit/react-mise-example-vite)

## Help me keep working on this project 💚

- [Follow on GitHub](https://github.com/tachibana-shin)
- [Follow on Twitter](https://twitter.com/tachib_shin)

## Documentation

To learn more about React Mise, check [its documentation](https://shin.is-a.dev/react-mise).

## Basic usage

stores/counter.ts
``` ts
import { defineStore } from "react-mise"

export const useCounterStore = defineStore({
  state: () => ({
    counter: 0
  }),
  getters: {
    double() {
      return this.counter * 2
    }
  },
  actions: {
    increment() {
      this.counter++
    }
  }
})
```

App.tsx
``` tsx
import { useCounterStore } from "./stores/counter"

export default function App() {
  const [counterStore] = useCounterStore()

  return (
    <>
      Counter: {counterStore.counter} <br />
      Double counter: {counterStore.double} <br />

      <button onClick={counterStore.increment}>counter++</button>
    </>
  )
}
```

## License

[MIT](http://opensource.org/licenses/MIT)

[https://shin.is-a.dev/react-mise](https://shin.is-a.dev/react-mise)
