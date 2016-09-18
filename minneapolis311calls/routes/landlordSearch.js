var express = require('express');
var router = express.Router();
var datalayer = require('../data/datalayer.js');

/* GET home page. */
router.get('/', function (req, res) {

    datalayer.getTopRentalLicenses(function (err, rows, fields) {
        if (!err) {
            res.render('index', { results: rows, title: 'Express' });
        }
        else
            console.log('Error while performing Query: ' + err);
    });
});


//Get Address Search Results, curently just searching by DB id for simplicity
router.get('/:landlordId', function (req, res) {
        console.log('Starting query')

        datalayer.rental311callsByLandlord(req.params.landlordId, function (err, rows, fields) {
        if (!err) {            
            res.render('landlordSearch', { landlordId: req.params.landlordId, resultsLl: rows[0], title: 'Landlord Search' });

            //  Send data to the debugger
            console.log('The solution is: ', rows);
        }
        else
            console.log('Error while performing Query: ' + err);
    });

});

module.exports = router;