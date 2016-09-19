var express = require('express');
var router = express.Router();
var datalayer = require('../data/datalayer.js');

//If the address is not a rental property
router.get('/', function (req, res) {
    res.render('addressSearch404', { title: 'Address Search | Not Found' });
});


//Get Address Search Results
router.get('/:address', function (req, res) {
    datalayer.rental311callsByAddress(req.params.address, function (err, rows, fields) {
        if (!err) {
            console.log('Starting query')
            if (rows.length) { //if we have results
                res.render('addressSearch', { address: req.params.address, results: rows[0], title: 'Address Search' });
            } else { //we have no results
                res.render('addressSearch', { address: req.params.address, title: 'Address Search' });
            };
        }
        else
            console.log('Error while performing Query: ' + err);
    });
});

module.exports = router;