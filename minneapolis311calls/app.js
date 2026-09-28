var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var GoogleMapsAPI = require('googlemaps');


var routes = require('./routes/index');
var users = require('./routes/users');
var addressSearch = require('./routes/addressSearch');
var landlordSearch = require('./routes/landlordSearch');
var map = require('./routes/map');
var app = express();


//setup favicon


//this is done so we can use moment in Jade templates
app.locals.moment = require('moment');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/addressSearch', addressSearch);
app.use('/landlordSearch', landlordSearch);
app.use('/map', map);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // HEAD responses must not have a body; rendering one here throws
        // ERR_STREAM_WRITE_AFTER_END on this Express/Node combination and
        // crashes the whole process.
        if (req.method === 'HEAD') {
            return res.end();
        }
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (req.method === 'HEAD') {
        return res.end();
    }
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
