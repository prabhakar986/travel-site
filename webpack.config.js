const path = require('path')

module.exports = {
    mode: "development",

    entry: './app/assets/scripts/App.js',
    output: {
        path:path.resolve(__dirname, "app"),
        filename: "bundled.js"
    }

}