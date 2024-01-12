import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import antdLayout from "vite-plugin-antd-layout";
import * as path from "path";

export default defineConfig({
  plugins: [react(), antdLayout()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: "@root-entry-name: default;",
      },
    },
  },
});
