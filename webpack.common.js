const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        library: 'Elodo',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    }
}
