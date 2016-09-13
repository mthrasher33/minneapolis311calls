var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var routes = require('./routes/index');
var users = require('./routes/users');
var addressSearch = require('./routes/addressSearch');
var landlordSearch = require('./routes/landlordSearch');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
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

////database connection. where is the correct place for this?
//var connection = mysql.createConnection({
//    host: 'bowie2.c44css47zkdo.us-west-2.rds.amazonaws.com',
//    user: 'master',
//    password: 'fri$nDgramming',
//    database: 'address_data'
//});

////create the connection
//connection.connect();

//connection.query('SELECT * from RentalLicense LIMIT 100', function (err, rows, fields) {
//    if (!err) {
//        //  Send data to the debugger
//        console.log('The solution is: ', rows);
//    }
//    else
//        console.log('Error while performing Query: ' + err);
//});





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
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
