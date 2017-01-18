module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  cookieSecret: process.env.COOKIE_SECRET,
  facebook: {
    clientId: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET
  },
  google: {
    clientId: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET
  }
};