const path = require('path')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
]

module.exports = {
    mode: "development",

    entry: './app/assets/scripts/App.js',
    output: {
        path:path.resolve(__dirname, "app"),
        filename: "bundled.js"
    },
    watch: true,

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader?url=false', {loader: "postcss-loader", options: {postcssOptions:{plugins: postCSSPlugins}}}]
            }
        ]
    }

}