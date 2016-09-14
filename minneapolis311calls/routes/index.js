var express = require('express');
var router = express.Router();
var mysql = require('mysql');


//database connection. where is the correct place for this?
var connection = mysql.createConnection({
    host: 'bowie2.c44css47zkdo.us-west-2.rds.amazonaws.com',
    user: 'master',
    password: 'fri$nDgramming',
    database: 'address_data'
});

//create the connection
connection.connect();

/* GET home page. */
router.get('/', function (req, res) {
    connection.query('SELECT * from RentalLicense LIMIT 100', function (err, rows, fields) {
        if (!err) {
            res.render('index', { results: rows, title:'Express' });
        }
        else
            console.log('Error while performing Query: ' + err);
    });

});

/*GET autocomplte for home page search*/
router.get('/search', function (req, res) {
    console.log("SEARCHING");
    connection.query('SELECT Address from RentalLicense where Address like "%' + req.query.key + '%"', function (err, rows, fields) {
        if (err) throw err;
        var data = [];
        console.log(req.query.key);
        for (i = 0; i < rows.length; i++) {
            data.push(rows[i].Address);
        }
        res.end(JSON.stringify(data));
    });
});

/* GET about page. */
router.get('/about', function (req, res) {
    res.render('about', { title: 'About' });
});

/* GET contact page. */
router.get('/contact', function (req, res) {
    res.render('contact', { title: 'Contact' });
});

module.exports = router;