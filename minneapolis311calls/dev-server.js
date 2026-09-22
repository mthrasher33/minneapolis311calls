// Development-only launcher.  Not used in production; bin/www is still the real entry point.
//
// Express 4.9.8 (2014) reads the private `res._headers` / `res._headerNames` properties that
// Node removed in v12.  On a modern Node that makes req.fresh throw inside res.send(), so every
// rendered page returns an empty 500.  The shim below restores those two properties from the
// public getters so the old Express can run on the locally installed Node.
//
// Usage:  node dev-server.js        (defaults to port 3000, override with PORT)

var http = require('http');

if (!Object.getOwnPropertyDescriptor(http.ServerResponse.prototype, '_headers')) {
    Object.defineProperty(http.ServerResponse.prototype, '_headers', {
        configurable: true,
        get: function () { return this.getHeaders(); }
    });
}

if (!Object.getOwnPropertyDescriptor(http.ServerResponse.prototype, '_headerNames')) {
    Object.defineProperty(http.ServerResponse.prototype, '_headerNames', {
        configurable: true,
        get: function () {
            var names = {};
            this.getHeaderNames().forEach(function (name) { names[name] = name; });
            return names;
        }
    });
}

// The functions in data/datalayer.js never check the error argument from pool.getConnection(),
// so any database failure throws on `connection.query` and takes the whole process down.  In
// development that means a single page load kills the server, so keep it alive and log instead.
process.on('uncaughtException', function (err) {
    console.error('\n[dev-server] Uncaught exception (server kept alive):');
    console.error(err.stack || err.message);
});

var app = require('./app');
var port = process.env.PORT || 3000;

app.set('port', port);

var server = app.listen(port, function () {
    console.log('Rental Researcher listening on http://localhost:' + server.address().port);
});
