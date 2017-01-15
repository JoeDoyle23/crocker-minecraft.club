'use strict';

const path = require('path');
const Hapi = require('hapi');
const Good = require('good');
const Inert = require('inert');

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