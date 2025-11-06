import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        server: {
            port: Number(env.VITE_PORT),
        },
        plugins: [
            react({
                babel: {
                    plugins: [["babel-plugin-react-compiler"]],
                },
            }),
        ],
    };
});
