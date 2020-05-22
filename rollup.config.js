import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.js',
    output: {
        dir: 'dist',
        format: 'umd',
        name: 'Elodo',
        globals: {
            axios: 'axios',
        },
    },
    external: ['axios'],
    plugins: [
        terser(),
    ],
};
