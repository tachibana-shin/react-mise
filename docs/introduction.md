# Introduction

React Mise started as an experiment to design what a Store for React could look like with the Composition API. Replace Redux and React Context

## Why should I use React Mise?

React Mise is a store library for React, it allows you to share a state across components/pages. If you are familiar with the Composition API, you might be thinking you can already share a global state with `useReducer`. This is true for single page applications but look it's complicated compared to management if it is server side rendered. But even in small single page applications, you get a lot from using React Mise:

- Accurate target response
- Hot module replacement
  - Modify your stores without reloading your page
  - Keep any existing state while developing
- Plugins: extend React Mise features with plugins
- Proper TypeScript support or **autocompletion** for JS users
- Server Side Rendering Support

## Basic example

This is what using react-mise looks like in terms of API (make sure to check the [Getting Started](./getting-started.md) for complete instructions). You start by creating a store:

```ts
// stores/counter.ts
import { defineStore } from "react-mise"

export const useCounterStore = defineStore("counter", {
  state: () => {
    return { count: 0 }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    }
  }
})
```

And then you _use_ it in a component:

```ts
import { useCounterStore } from "src/stores/counter"

export default function App() {
  const [counter] = useCounterStore()

  // with autocompletion ✨
  counter.count++
  // or using an action instead
  counter.increment()
}
```

## Why _React Mise_

Mise (`kanji: 店`) pronounced mi'se which means store in Japanese. combined `React Mise` means the store for React.

## A more realistic example

Here is a more complete example of the API you will be using with React Mise **with types even in JavaScript**. For some people, this might be enough to get started without reading further but we still recommend checking the rest of the documentation or even skipping this example and coming back once you have read about all of the _Core Concepts_.

```js
import { defineStore } from "react-mise"

export const useTodos = defineStore("todos", {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: "all",
    // type will be automatically inferred to number
    nextId: 0
  }),
  getters: {
    finishedTodos(state) {
      // autocompletion! ✨
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === "finished") {
        // call other getters with autocompletion ✨
        return this.finishedTodos
      } else if (this.filter === "unfinished") {
        return this.unfinishedTodos
      }
      return this.todos
    }
  },
  actions: {
    // any amount of arguments, return a promise or not
    addTodo(text) {
      // you can directly mutate the state
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    }
  }
})
```

## Replace with Redux

React Mise started when I tried to use Redux in my React project and failed due to the unclear APIs. I used to use `React` and it has `react-mise` status manager that is amazing. And then React Mise was created.

Compared to Redux, React Mise provides a simpler API with less ceremony, offers Composition-API-style APIs, and most importantly, has solid type inference support when used with TypeScript.

### Comparison with Redux

> Redux 3.x is Redux for React 2 while Redux 4.x is for React 3

React Mise API is very different from Redux, namely:

- _mutations_ no longer exist. They were very often perceived as **_extremely_ verbose**. They initially brought devtools integration but that is no longer an issue.
- No need to create custom complex wrappers to support TypeScript, everything is typed and the API is designed in a way to leverage TS type inference as much as possible.
- No more magic strings to inject, import the functions, call them, enjoy autocompletion!
- No need to dynamically add stores, they are all dynamic by default and you won't even notice. Note you can still manually use a store to register it whenever you want but because it is automatic you don't need to worry about it.
- No more nested structuring of _modules_. You can still nest stores implicitly by importing and _using_ a store inside another but React Mise offers a flat structuring by design while still enabling ways of cross composition among stores. **You can even have circular dependencies of stores**.
- No _namespaced modules_. Given the flat architecture of stores, "namespacing" stores is inherent to how they are defined and you could say all stores are namespaced.

For more detailed instructions on how to convert an existing Redux project to use React Mise, see the [Migration from Redux Guide](./cookbook/migration-redux.md).
