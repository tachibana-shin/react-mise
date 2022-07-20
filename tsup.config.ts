import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  splitting: true,
  dts: true,
  format: ["cjs", "iife"],
  target: "es2015",
  external: ["react"]
})
