const path = require('path')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
]

module.exports = {
    
    entry: './app/assets/scripts/App.js',
    output: {
        path:path.resolve(__dirname, "app"),
        filename: "bundled.js"
    },

    devServer: {
        /*to auto reload all html files in app folder*/
        before: function(app, server) {
            server._watch( './app/**/*.html' )
        },

        /*to auto reload all CSS and js files in app folder*/
        contentBase: path.join(__dirname, 'app'),

        hot: true,
        port: 3000,

        /*to open in any device using ipv4 address(192.168.1.6) with port number (:3000) as 192.168.1.6:3000*/
        host: '0.0.0.0'
    },

    mode: "development",
    
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader?url=false', {loader: "postcss-loader", options: {postcssOptions:{plugins: postCSSPlugins}}}]
            }
        ]
    }    

}