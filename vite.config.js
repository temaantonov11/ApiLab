import { defineConfig } from "vite";
import { resolve } from 'path'

export default defineConfig({
    base: "/ApiLab/",
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                weather: resolve(__dirname, 'weather.html'),
                pokemons: resolve(__dirname, 'pokemons.html'),
                crypto: resolve(__dirname, 'crypto.html')
            }
        }
    }
})