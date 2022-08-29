module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/vue-ticket-thing/" : "/",
  transpileDependencies: [
    'vuetify'
  ]
}
