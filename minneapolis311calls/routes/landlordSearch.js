var express = require('express');
var router = express.Router();
var datalayer = require('../data/datalayer.js');

//Get Address Search Results, curently just searching by DB id for simplicity
router.get('/:landlordName', function (req, res) {
        console.log('Starting query')

        datalayer.rental311callsByLandlord(req.params.landlordName, function (err, rows, fields) {
            if (!err) {     
                var propertyCountForOwner = null;
                datalayer.PropertiesOwnedByLandlord(req.params.landlordName, function (err, properties, fields) {
                    if (!err) {
                        var firstResult = rows[0];
                        propertyCountForOwner = properties[0].length;
                        //Get the minimum data
                        //see here: http://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
                        var minDate = Math.max.apply(null, properties[0].map(function (o) { return o.IssueDate; }));
                        var ownerSinceDate = new Date(minDate);
                        res.render('landlordSearch', { landlordName: req.params.landlordName, calls311: firstResult, propertyCountForOwner: propertyCountForOwner, ownerSinceDate: ownerSinceDate, title: 'Landlord Search', path: req.path});
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