import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: "globalThis",
    "process.env": {},
    "window.global": "window",
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        (
          await import("@esbuild-plugins/node-globals-polyfill")
        ).NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
