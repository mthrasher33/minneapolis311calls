var express = require('express');
var router = express.Router();
var datalayer = require('../data/datalayer.js');

//Get Address Search Results, curently just searching by DB id for simplicity
router.get('/:landlordName', function (req, res) {
        console.log('Starting query')

        datalayer.rental311callsByLandlord(req.params.landlordName, function (err, rows, fields) {
            if (!err) {     
                var propertyCountForOwner = null;
                datalayer.PropertiesOwnedByLandlord(rows[0][0].APP_NAME, function (err, properties, fields) {
                    if (!err) {
                        var firstResult = rows[0];
                        propertyCountForOwner = properties[0].length;
                        res.render('landlordSearch', { landlordName: req.params.landlordName, resultsLl: rows[0], propertyCountForOwner: propertyCountForOwner, title: 'Landlord Search' });
                    }
                    else
                        console.log('Error while performing Query: ' + err);
                });
            //  Send data to the debugger
            console.log('The solution is: ', rows);
        }
        else
            console.log('Error while performing Query: ' + err);
    });

});

module.exports = router;