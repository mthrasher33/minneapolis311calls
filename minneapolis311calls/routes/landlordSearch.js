var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var datalayer = require('../data/datalayer.js');

//database connection. where is the correct place for this?
var connection = mysql.createConnection({
    host: 'bowie2.c44css47zkdo.us-west-2.rds.amazonaws.com',
    user: 'master',
    password: 'fri$nDgramming',
    database: 'address_data'
});


//Get Address Search Results, curently just searching by DB id for simplicity
router.get('/:landlordId', function (req, res) {
        datalayer.query("Call rental311callsByLandlord(?)", [req.params.landlordId], function (err, rows, fields) {
        if (!err) {
            console.log('Starting query')
            res.render('landlordSearch', { landlordId: req.params.landlordId, resultsLl: rows[0], title: 'Landlord Search' });

            //  Send data to the debugger
            console.log('The solution is: ', rows);
        }
        else
            console.log('Error while performing Query: ' + err);
    });

});

module.exports = router;