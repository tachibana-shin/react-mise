## Installation

Install `react-mise` with your favorite package manager:

```bash
yarn add react-mise
# or with npm
npm install react-mise
# or with pnpm
pnpm add react-mise
```

No need for global object. you don't need something like `Provider` like `Redux` or `React hooks`. it makes the application silly when you need to use multiple stores for 1 component.

## What is a Store?

A Store (like React Mise) is an entity holding state and business logic that isn't bound to your Component tree. In other words, **it hosts global state**. It's a bit like a component that is always there and that everybody can read off and write to. It has **three concepts**, the [state](./core-concepts/state.md), [getters](./core-concepts/getters.md) and [actions](./core-concepts/actions.md) and it's safe to assume these concepts are the equivalent in components.

## When should I use a Store

A store should contain data that can be accessed throughout your application. This includes data that is used in many places, e.g. User information that is displayed in the navbar, as well as data that needs to be preserved through pages, e.g. a very complicated multi-step form.

On the other hand, you should avoid including in the store local data that could be hosted in a component instead, e.g. the visibility of an element local to a page.

Not all applications need access to a global state, but if yours need one, React Mise will make your life easier.
