var express = require('express');
var router = express.Router();
var datalayer = require('../data/datalayer.js');
var geojson = require('geojson');
var GoogleMapsAPI = require('googlemaps');
//google maps api
var publicConfig = {
    key: 'AIzaSyDayPCImvnZVbuobzkNwSFhDpolpHYm6Wo',
    stagger_time: 1000,
    encode_polylines: false,
    secure: true
};

//Get Address Search Results, curently just searching by DB id for simplicity
router.get('/:landlordName', function (req, res) {
        console.log('Starting query')

        datalayer.rental311callsByLandlord(req.params.landlordName, function (err, rows, fields) {
            if (!err) {
                var propertyCountForOwner = null;
                datalayer.PropertiesOwnedByLandlord(req.params.landlordName, function (err, properties, fields) {
                    if (!err) {
                        var resultSetof311Calls = rows[0];
                        propertyCountForOwner = properties[0].length;

                        var outlist = []
                        var bbox = {minx:Infinity, miny:Infinity, maxx:-Infinity, maxy:-Infinity}
                        for (i in properties[0]) {
                          row = properties[0][i]

                          if (row['X'] < bbox.minx) {
                            bbox.minx = row['X']
                          }
                          if (row['Y'] < bbox.miny) {
                            bbox.miny = row['Y']
                          }
                          if (row['X'] > bbox.maxx) {
                            bbox.maxx = row['X']
                          }
                          if (row['Y'] > bbox.maxy) {
                            bbox.maxy = row['Y']
                          }
                          owner = row['App_Name']
                          owner_encoded = encodeURIComponent(owner)
                          address = row['Address']
                          address_encoded = encodeURIComponent(address)
                          landlord = row['ContactName']
                          landlord_encoded = encodeURIComponent(landlord)
                          row["link"] = address
                          var pop_up_text = '<p><a href=../addressSearch/{address_encoded}>{address}</a></p>'.format({ address: address, address_encoded: address_encoded })
                          var outrow = {
                            pop_up_text: pop_up_text,
                            X : row['X'],
                            Y : row['Y']
                          }
                          outlist.push(outrow)
                        };
                        geo = geojson.parse(outlist, {Point: ['Y', 'X']})
                        // change to latlngbounds for leaflet
                        var latlngbounds = [[bbox.miny, bbox.minx], [bbox.maxy, bbox.maxx]]


                        // get a google street view image for each property owned
                        // add that image to each property and ship it to the client
                        //console.log("PROPERTIES: " + properties[0]);
                        var gmAPI = new GoogleMapsAPI(publicConfig);

                        properties[0].forEach(function(property){
                           var lat = property.Y;
                           var long = property.X;
                           var params = {
                             location: lat + ',' + long,
                             size: '300x400'//,
                             //heading: 108.4,
                             //pitch: 7,
                             //fov: 40
                            };
                            var streetView_image = gmAPI.streetView(params);

                            //assign to the object
                            property.image_url = streetView_image;
                       });

                        //Get the minimum data
                        //see here: http://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
                        var minDate = Math.max.apply(null, properties[0].map(function (o) { return o.IssueDate; }));
                        var ownerSinceDate = new Date(minDate);

                        res.render('landlordSearch', {
                          bbox:JSON.stringify(latlngbounds),
                          geo: JSON.stringify(geo),
                          landlordName: req.params.landlordName,
                          calls311: resultSetof311Calls,
                          propertyCountForOwner: propertyCountForOwner,
                          ownerSinceDate: ownerSinceDate,
                          properties: properties,
                          title: 'Landlord Search' 
                        });
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
