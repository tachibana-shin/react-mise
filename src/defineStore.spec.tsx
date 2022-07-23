import { act, fireEvent, render, screen } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, test } from "vitest"

import { defineStore } from "./defineStore"

function createStores() {
  const useStore1 = defineStore({
    // id: "store1",
    state: () => ({
      count: 0
    }),
    getters: {
      doubleCount() {
        return this.count * 2
      }
    },
    actions: {
      increment() {
        // eslint-disable-next-line functional/immutable-data
        this.count += 1
      },
      reset() {
        // eslint-disable-next-line functional/immutable-data
        this.count = 0
      }
    }
  })
  const useStore2 = defineStore({
    state: () => ({
      count: 0
    }),
    getters: {
      doubleCount() {
        return this.count * 2
      }
    },
    actions: {
      increment() {
        // eslint-disable-next-line functional/immutable-data
        this.count += 1
      },
      increment2() {
        const [store1] = useStore1()

        store1.increment()
      },
      reset() {
        // eslint-disable-next-line functional/immutable-data
        this.count = 0
      }
    }
  })

  return { useStore1, useStore2 }
}

describe("one store", () => {
  const { useStore1 } = createStores()

  function App() {
    const [counterStore] = useStore1()

    return (
      <div>
        <div data-testid="counter">{counterStore.count}</div>
        <div data-testid="dbl-counter">{counterStore.doubleCount}</div>

        <button data-testid="counter++" onClick={counterStore.increment}>
          count++
        </button>
      </div>
    )
  }

  beforeEach(() => {
    render(<App />)
  })

  test("should update the counter", () => {
    const counter = screen.getByTestId("counter")
    const counterPP = screen.getByTestId("counter++")

    expect(counter.innerHTML === "0").toEqual(true)

    fireEvent.click(counterPP)

    expect(counter.innerHTML === "1").toEqual(true)

    fireEvent.click(counterPP)
    fireEvent.click(counterPP)

    expect(counter.innerHTML === "3").toEqual(true)
  })

  test("should computed update", () => {
    const counterPP = screen.getByTestId("counter++")
    const dblCounter = screen.getByTestId("dbl-counter")

    expect(dblCounter.innerHTML === "6").toEqual(true)

    fireEvent.click(counterPP)

    expect(dblCounter.innerHTML === "8").toEqual(true)

    fireEvent.click(counterPP)
    fireEvent.click(counterPP)

    expect(dblCounter.innerHTML === "12").toEqual(true)
  })
})

describe("multiple store", () => {
  const { useStore1, useStore2 } = createStores()

  function App() {
    // const [store2] = useStore2()
    const [store1] = useStore1()
    const [store2] = useStore2()

    return (
      <div>
        <div data-testid="dbl-1">{store1.doubleCount}</div>
        <div data-testid="dbl-2">{store2.doubleCount}</div>
        <button data-testid="btn-1" onClick={store1.increment}>
          {store1.count}
        </button>
        <button data-testid="btn-2" onClick={store2.increment}>
          {store2.count}
        </button>
      </div>
    )
  }

  beforeEach(() => {
    render(<App />)
  })

  test("should update by stores", () => {
    const btn1 = screen.getByTestId("btn-1")
    const btn2 = screen.getByTestId("btn-2")

    expect(btn1.innerHTML).toBe("0")
    expect(btn2.innerHTML).toBe("0")

    fireEvent.click(btn1)

    expect(btn1.innerHTML).toBe("1")
    expect(btn2.innerHTML).toBe("0")

    fireEvent.click(btn2)

    expect(btn1.innerHTML).toBe("1")
    expect(btn2.innerHTML).toBe("1")
  })
  test("should computed updated", () => {
    expect(screen.getByTestId("dbl-1").innerHTML).toEqual("2")
    expect(screen.getByTestId("dbl-2").innerHTML).toEqual("2")

    fireEvent.click(screen.getByTestId("btn-2"))

    expect(screen.getByTestId("dbl-1").innerHTML).toEqual("2")
    expect(screen.getByTestId("dbl-2").innerHTML).toEqual("4")
  })
})

describe("call store in store", () => {
  const { useStore1, useStore2 } = createStores()

  function App() {
    // const [store2] = useStore2()
    const [store1] = useStore1()
    const [store2] = useStore2()

    return (
      <div>
        <div data-testid="dbl-1">{store1.doubleCount}</div>
        <div data-testid="dbl-2">{store2.doubleCount}</div>
        <button data-testid="btn-1" onClick={store1.increment}>
          {store1.count}
        </button>
        <button data-testid="btn-2" onClick={store2.increment2}>
          {store2.count}
        </button>
      </div>
    )
  }

  beforeEach(() => {
    render(<App />)
  })

  test("should call store in store", () => {
    act(() => {
      useStore2()[0].increment2()
    })

    expect(useStore1()[0].count).toEqual(1)

    act(() => {
      useStore1()[0].reset()
    })
  })
  test("should update by call store in store", () => {
    const btn1 = screen.getByTestId("btn-1")
    const btn2 = screen.getByTestId("btn-2")

    expect(btn1.innerHTML).toBe("0")
    expect(btn2.innerHTML).toBe("0")

    fireEvent.click(btn1)

    expect(btn1.innerHTML).toBe("1")
    expect(btn2.innerHTML).toBe("0")

    fireEvent.click(btn2)

    expect(btn1.innerHTML).toBe("2")
    expect(btn2.innerHTML).toBe("0")
  })
  test("should computed updated", () => {
    expect(screen.getByTestId("dbl-1").innerHTML).toEqual("4")
    expect(screen.getByTestId("dbl-2").innerHTML).toEqual("0")

    fireEvent.click(screen.getByTestId("btn-2"))

    expect(screen.getByTestId("dbl-1").innerHTML).toEqual("6")
    expect(screen.getByTestId("dbl-2").innerHTML).toEqual("0")
  })
})

describe("use one store in stack", () => {
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
        const [store1] = useStore1(true)

        store1.increment()
      }
    }
  })

  function Button1() {
    const [store1] = useStore1()

    return (
      <button data-testid="btn" onClick={store1.increment}>
        {store1.count}
      </button>
    )
  }

  function App() {
    // const [store2] = useStore2()
    const [store1] = useStore1()
    const [store2] = useStore2()

    return (
      <div>
        {store1.count}
        <Button1 />
        <button onClick={store2.increment}>count is {store2.count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    )
  }

  beforeEach(() => {
    render(<App />)
  })

  test("should render", () => {
    const btn = screen.getByTestId("btn")

    expect(btn.innerHTML).toEqual("0")

    fireEvent.click(btn)

    expect(btn.innerHTML).toEqual("1")
  })
})
