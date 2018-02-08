module.exports = {
    entry: './src/index.js',
    watch: true,
    output: {
      filename: './public/assets/js/bundle.js'
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015' ]
        }
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader?-url'
      }]
    }
  };
  