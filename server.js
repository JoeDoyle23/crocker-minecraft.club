'use strict';

require('dotenv').config()

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const settings = require('./config/settings');

const server = express();

server.use(express.static('public', {
  index: [ 'index.html' ],
  extensions: [ 'html' ] 
}));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(compression());
server.use(cookieParser(settings.cookieSecret));
server.use(morgan('common'));
server.use(passport.initialize());
server.use(passport.session());

if (settings.env !== 'production') {
  // only use in development
  server.use(errorhandler());
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: settings.facebook.clientId,
    clientSecret: settings.facebook.clientSecret,
    callbackURL: 'http://localhost:3001/auth/facebook'
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, { id: profile.id, name: profile.displayName, provider: profile.provider });
  }
));

passport.use(new GoogleStrategy({
    clientID: settings.google.clientId,
    clientSecret: settings.google.clientSecret,
    callbackURL: "http://localhost:3001/auth/google"
  },
  function(token, tokenSecret, profile, done) {
    done(null, { id: profile.id, name: profile.displayName, provider: profile.provider });
  }
));

server.get('/auth/fb', passport.authenticate('facebook'));
server.get('/auth/goog', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

server.get('/auth/facebook', passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/login' }));
server.get('/auth/google', passport.authenticate('google', { successRedirect: '/profile', failureRedirect: '/login' }));

const listener = server.listen(settings.port || 3001, () => {
  console.log(`Crocker Minecraft Club Web Server on port ${listener.address().port}`);
});

process.on('SIGTERM', () => {
  server.close(() =>{
    process.exit(0);
  });
});