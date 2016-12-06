var express = require('express');
var router = express.Router();
var geojson = require('geojson')
var datalayer = require('../data/datalayer.js');

// and we copied this from http://stackoverflow.com/questions/18405736/is-there-a-c-sharp-string-format-equivalent-in-javascript
// i could not handle not having format as a string method
String.prototype.format = function(placeholders) {
    var s = this;
    for(var propertyName in placeholders) {
        var re = new RegExp('{' + propertyName + '}', 'gm');
        s = s.replace(re, placeholders[propertyName]);
    }
    return s;
};

router.get('/', function (req, res){
   res.render('map', {title: "Map"})
});
router.get('/geojson', function (req, res){

  var bbox = [+req.query.East,+req.query.South, +req.query.West, +req.query.North]
  datalayer.getPointsInArea(bbox, function (err, rows, fields) {
      if (!err) {
          var rows_with_pop_up = []
          var outlist = []
          for (i in rows) {
            row = rows[i]
            owner = row['App_Name']
            owner_encoded = encodeURIComponent(owner)
            address = row['Address']
            address_encoded = encodeURIComponent(address)
            landlord = row['ContactName']
            landlord_encoded = encodeURIComponent(landlord)
            row["link"] = address
            row['pop_up_text'] = '<p><a href=../addressSearch/{address_encoded}>{address}</a></p>'.format({ address: address, address_encoded: address_encoded })
            row['pop_up_text'] += '<p><a href=../landlordSearch/{owner_encoded}>{owner}</a></p>'.format({ owner: owner, owner_encoded: owner_encoded})
            row['pop_up_text'] += '<p>Landlord: <a href=../landlordSearch/{landlord_encoded}>{landlord}</a></p>'.format({ landlord: landlord, landlord_encoded: landlord_encoded })

            outlist.push(row)
          };
          console.log(outlist)
          geo = geojson.parse(outlist, {Point: ['y', 'x']})
          res.send(geo)
      }
      else
          console.log('Error while performing Query: ' + err);
  });
});

module.exports = router;
