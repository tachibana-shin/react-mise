import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  splitting: true,
  minify: true,
  dts: true,
  format: ["cjs", "esm", "iife"],
  target: "es2015",
  external: ["react"],
  treeshake: true
})
