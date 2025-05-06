import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["102a1a158c9a28ba28059f9c83bf8fd2.serveo.net"],
  },
  define: {
    global: "globalThis",
    "process.env": {},
    "window.global": "window",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
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
