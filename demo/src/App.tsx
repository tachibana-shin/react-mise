import reactLogo from "./assets/react.svg"
import "./App.css"

// eslint-disable-next-line import/order, n/no-unpublished-import
import { defineStore } from "../../src/index"

const useStore1 = defineStore({
  // id: "store1",
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount() {
      console.log(this)
      return this.count * 2
    }
  },
  actions: {
    increment() {
      // eslint-disable-next-line functional/immutable-data
      this.count += 1
    }
  }
})
const useStore2 = defineStore({
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      // eslint-disable-next-line functional/immutable-data
      this.count += 1
    },
    increment2() {
      const [store1] = useStore1()

      store1.increment()
    }
  }
})

function App() {
  // const [store2] = useStore2()
  const [store1] = useStore1()
  const [store2] = useStore2()

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={store2.increment2}>
          count is {store1.count}. double is {store1.doubleCount}
        </button>
        <button onClick={store2.increment}>count is {store2.count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
