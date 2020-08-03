module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  devServer: {
    host: "localhost",
  },
  // publicPath: process.env.NODE_ENV === "production" ? "/LAB12/" : "/"
};

// module.exports = {
//   devServer: {
//     proxy: {
//       '/api': {"הכתובת של השרת שלכם"',
//         ws: true,
//         changeOrigin: true
//       }
//     }
//   }
// }
