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
            //console.log(rows);
            if (rows.length) { //if we have results
                res.render('addressSearch', { address: req.params.address, results: rows, title: 'Address Search' });
            } else { //we have no results
//                res.render('addressSearch', { address: req.params.address, title: 'Address Search' });
            };
                    console.log("ROWS[0]: " + rows[0]);
                    console.log("LENGTH: " + rows[0].length);
        }
        else
            console.log('Error while performing Query: ' + err);
    });
});

module.exports = router;