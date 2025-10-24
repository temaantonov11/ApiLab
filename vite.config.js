import { defineConfig } from "vite";
import { resolve } from 'path'

export default defineConfig({
    base: "/ApiLab/",
    build: {
        input: {
            main: resolve(__dirname, 'index.html'),
            weather: resolve(__dirname, 'weather.html'),
        }
    }
})