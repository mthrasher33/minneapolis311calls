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

//If the address is not a rental property
router.get('/', function (req, res) {
    res.render('addressSearch404', { title: 'Address Search | Not Found' });
});


//Get Address Search Results, curently just searching by DB id for simplicity
//if we get no results, the address has 0 311 calls
router.get('/:addressId', function (req, res) {
        connection.query("Call rental311callsByAddress(?)", [req.params.addressId], function (err, rows, fields) {
        if (!err) {
            console.log('Starting query')
            if (rows.length) { //if we have results
                res.render('addressSearch', { addressID: req.params.addressId, results: rows[0], title: 'Address Search' });
            } else { //we have no results
                res.render('addressSearch', { addressID: req.params.addressId, title: 'Address Search' });
            };
        }
        else
            console.log('Error while performing Query: ' + err);
    });

});

module.exports = router;