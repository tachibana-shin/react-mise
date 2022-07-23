import { defineConfig } from "vitest/config"

export default defineConfig({
  define: {
    __DEV__: false
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
})
