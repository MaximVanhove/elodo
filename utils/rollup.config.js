import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'utils/utils.js',
    output: {
        dir: 'src',
    },
    plugins: [
        commonjs(),
        resolve(),
    ],
};
