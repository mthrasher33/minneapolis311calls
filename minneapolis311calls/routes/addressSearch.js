var express = require('express');
var router = express.Router();
var datalayer = require('../data/datalayer.js');
var GoogleMapsAPI = require('googlemaps');
var zillow = require('node-zillow');
var request = require('request');
var config = require('../config')['production'];

//google maps api
var publicConfig = {
    key: 'AIzaSyDayPCImvnZVbuobzkNwSFhDpolpHYm6Wo',
    stagger_time: 1000,
    encode_polylines: false,
    secure: true
};


//If the address is not a rental property
router.get('/', function (req, res) {
    res.render('addressSearch404', { title: 'Address Search | Not Found', path: req.path });
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
                        
                        //get the streetview from google maps api
                        var gmAPI = new GoogleMapsAPI(publicConfig);
                        var lat = rows[0][0].Y;
                        var long = rows[0][0].X;
                        var params = {
                            location: lat + ',' + long,
                            size: '1200x1600'//,
                            //heading: 108.4,
                            //pitch: 7,
                            //fov: 40
                        };
                        var streetView_image = gmAPI.streetView(params);
                        

                        //get the zillow info for the property
                        var streetNum = rows[0][0].Address.split(' ')[0];
                        var streetName = rows[0][0].Address.split(' ')[1];
                        var streetType= rows[0][0].Address.split(' ')[2];
                        var zpidURL = 'http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id='+config.zillowAPIKey+'&address=' + streetNum + '+' + streetName + '+' + streetType + '&citystatezip=Minneapolis%2C+MN&rentzestimate=true'
                        request(zpidURL, function(error, response, body){
                            if (!error){
                                var zpid = body.split('<zpid>')[1].split('</zpid>')[0];
                                //var zestimateURL = 'http://www.zillow.com/webservice/GetZestimate.htm?zws-id=X1-ZWz199abp5hssr_282ek&zpid=' + zpid + '&rentzestimate=true'; 
                                //request(zestimateURL, function(error,response,body){
                                  //  if(!error){
                                        //console.log(body);
                                        var allZestimateData = body.split('<rentzestimate>')[1].split('</rentzestimate')[0];
                                        var zestimateAmount = allZestimateData.split('<amount currency="USD">')[1].split('</amount>')[0];
                                        var zestimateLastUpdated = allZestimateData.split('<last-updated>')[1].split('</last-updated>')[0];
                                        //var zestimateOneWeekChange = allZestimateData.split('<oneWeekChange>')[1].split('</oneWeekChange>')[0];
                                        var zestimateValueChangeDuration = allZestimateData.split('<valueChange duration="')[1].split('" currency="USD">')[0];
                                        var zestimateValueChange = allZestimateData.split('<valueChange duration="'+ zestimateValueChangeDuration+'" currency="USD">')[1].split('</valueChange>')[0];
                                        //console.log(zestimateAmount);
                                        //console.log(zestimateLastUpdated);
                                        //console.log(zestimateValueChangeDuration);
                                        //console.log(zestimateValueChange);
                                  //  }
                                //})
                            } else {
                                console.log("There was an error with the zillow http call: " + error);
                            }
                        })

                        propertyCountForOwner = properties[0].length;
                        res.render('addressSearch', { address: req.params.address, results: rows, propertyCountForOwner: propertyCountForOwner, title: 'Address Search', path: req.path, streetView_image: streetView_image});
//                        console.log("Result of google api: " + result);

                        //console.log(req.path)
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