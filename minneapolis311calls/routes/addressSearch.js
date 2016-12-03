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
            //if we have results
            if (rows.length) { 
                var propertyCountForOwner = null;
                datalayer.PropertiesOwnedByLandlord(rows[0][0].APP_NAME, function (err, properties, fields) {
                    if (!err) {
                        propertyCountForOwner = properties[0].length;
                        res.render('addressSearch', { address: req.params.address, results: rows, propertyCountForOwner: propertyCountForOwner, title: 'Address Search' });
                    }
                    else
                        console.log('Error while performing Query: ' + err);
                });
                
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