// eslint-disable-next-line n/no-unpublished-import
import { defineConfig } from "vite"

// import TypeDocPlugin from './vite-typedoc-plugin'

export default defineConfig({
  clearScreen: false,
  define: {
    __DEV__: "true",
    __BROWSER__: "true"
  },
  server: {
    port: 3000,
    hmr: process.env.GITPOD_WORKSPACE_URL
      ? {
          // removes the protocol and replaces it with the port we're connecting to
          host: process.env.GITPOD_WORKSPACE_URL.replace("https://", "3000-"),
          protocol: "wss",
          clientPort: 443
        }
      : true
  },
  optimizeDeps: {
    exclude: ["vue-demi", "@vueuse/shared", "@vueuse/core", "react-mise"]
  }
})
