import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = "/HanDongtest/";

export default defineConfig({
  base,
  plugins: [react()],
});
