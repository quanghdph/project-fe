module.exports = {
    plugins: [
      new CopyPlugin([{
          from: './node_modules/@pdftron/webviewer/public',
          to: './dist/public/webviewer'
        }]
      ),
    ],
  };