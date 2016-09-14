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

/*POST to check if user input is in database*/
router.post('/check', function (req, res) {
    console.log("POST METHOD:");
    console.log(req.body.typeahead) //returns what the user typed in the box

    //sanitize and validate the input
    //TODO

    //connect to database and search the input in the address column
    connection.query('SELECT DISTINCT Address from RentalLicense where Address like "%' + req.body.typeahead + '%"', function (err, rows, fields) {
        console.log("Querying the database...");
        console.log("number of rows returned:");
        console.log(rows.length);
        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i]);
        };
        if (err) {
            throw err;
        }

        //if there is an exact match, route there (1408 Monroe St. NE)
        //if there is one partial match, route there (1408 Monroe --> 1408 Monroe St. NE)
        else if (rows.length === 1) {
            res.redirect('/addressSearch/' + rows[0].Address);
        }

        //if no partial match, display a list of all possibilites (14 --> 1408 Monroe St. NE, 1424 Madison St. NE, etc.)
        else if (rows.length > 1) {
            res.render('addressSearchDYM', {results: rows, title: "Search Suggestions"}); //send to the did you mean page?
        }

        //if we have nothing, display a sorry message and allow them to link back to the search box
        else {            
            res.render('addressSearch404', { title: 'No Results' });
        };

   

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