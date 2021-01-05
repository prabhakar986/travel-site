const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

const postCSSPlugins = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-hexrgba'),
    require('autoprefixer')
]

class RunAfterComplile {
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', function() {
            fse.copySync('./app/assets/images', './docs/assets/images')
        })
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: ['css-loader?url=false', {loader: "postcss-loader", options: {postcssOptions:{plugins: postCSSPlugins}}}]
}

let pages = fse.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`
    })
})

let config = {

    entry: './app/assets/scripts/App.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig
        ]
    } 
}

if (currentTask == 'dev') {
    cssConfig.use.unshift('style-loader')
    config.output = {
        path:path.resolve(__dirname, "app"),
        filename: "bundled.js"
    }

    config.devServer = {
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
    }

    config.mode = 'development'
    config.devtool = 'eval-source-map'
}

if (currentTask == 'build') {

    config.module.rules.push({
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
    })


    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    //postCSSPlugins.push(require('cssnano'))  //use only this line to compress large css file
    config.output = {
        filename:  '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path:path.resolve(__dirname, "docs")
    }

    config.mode = 'production'
    
    config.optimization = {
        splitChunks: { cacheGroups: { vendor: {test: /[\\/]node_modules[\\/]/, name: 'vendors', enforce: true, chunks: 'all'}}}
    }

    config.plugins.push(
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
        new RunAfterComplile()
    )

}


module.exports = config