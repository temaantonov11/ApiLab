import { defineConfig } from "vite";

export default defineConfig({
    base: "/ApiLab/",
    build: {
        input: {
            main: resolve(__dirname, 'index.html'),
            weather: resolve(__dirname, 'weather.html'),
        }
    }
})