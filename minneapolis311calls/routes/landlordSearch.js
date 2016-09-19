var express = require('express');
var router = express.Router();
var datalayer = require('../data/datalayer.js');

//Get Address Search Results, curently just searching by DB id for simplicity
router.get('/:landlordName', function (req, res) {
        console.log('Starting query')

        datalayer.rental311callsByLandlord(req.params.landlordName, function (err, rows, fields) {
            if (!err) {     
                var firstResult = rows[0];
                res.render('landlordSearch', { landlordName: req.params.landlordName, resultsLl: rows[0], title: 'Landlord Search' });

            //  Send data to the debugger
            console.log('The solution is: ', rows);
        }
        else
            console.log('Error while performing Query: ' + err);
    });

});

module.exports = router;