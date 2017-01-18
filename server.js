'use strict';

require('dotenv').config()

const path = require('path');
const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');
const bell = require('bell');
const authCookie = require('hapi-auth-cookie');
const settings = require('./config/settings');

// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({ 
  port: 3001 
});

server.register(Inert, () => {});
server.register([authCookie, bell], function (err) {

  server.auth.strategy('session', 'cookie', {
    password: settings.cookieSecret, //Use something more secure in production
    redirectTo: '/login', //If there is no session, redirect here
    isSecure: false //Should be set to true (which is the default) in production
  });

    // Declare an authentication strategy using the bell scheme
    // with the name of the provider, cookie encryption password,
    // and the OAuth client credentials.
    server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        password: settings.cookieSecret,
        isSecure: false,
        // You'll need to go to https://developers.facebook.com/ and set up a
        // Website application to get started
        // Once you create your app, fill out Settings and set the App Domains
        // Under Settings >> Advanced, set the Valid OAuth redirect URIs to include http://<yourdomain.com>/bell/door
        // and enable Client OAuth Login
        clientId: settings.facebook.clientId,
        clientSecret: settings.facebook.clientSecret,
        location: server.info.uri
    });

    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: settings.cookieSecret,
        isSecure: false,
        // You'll need to go to https://console.developers.google.com and set up an application to get started
        // Once you create your app, fill out "APIs & auth >> Consent screen" and make sure to set the email field
        // Next, go to "APIs & auth >> Credentials and Create new Client ID
        // Select "web application" and set "AUTHORIZED JAVASCRIPT ORIGINS" and "AUTHORIZED REDIRECT URIS"
        // This will net you the clientId and the clientSecret needed.
        // Also be sure to pass the location as well. It must be in the list of "AUTHORIZED REDIRECT URIS"
        // You must also enable the Google+ API in your profile.
        // Go to APIs & Auth, then APIs and under Social APIs click Google+ API and enable it.
        clientId: settings.google.clientId,
        clientSecret: settings.google.clientSecret,
        location: server.info.uri
    });

    server.route({
        method: '*',
        path: '/bell/door',
        config: {
            auth: {
                strategies: ['facebook', 'google'],
                mode: 'try'
            },
            handler: function (request, reply) {

                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }
                reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
            }
        }
    });

});


// Add the route
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            defaultExtension: 'html',
            index: true
        }
    }
});


// Start the server
server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        server.log('info', 'Crocker Minecraft Club Server running at: ' + server.info.uri);
    });
});

process.on('SIGTERM', () => {
  server.stop(() =>{
    process.exit(0);
  });
});