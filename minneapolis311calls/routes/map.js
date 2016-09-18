var express = require('express');
var router = express.Router();
var geojson = require('geojson')
var datalayer = require('../data/datalayer.js');

router.get('/', function (req, res){
   res.render('map', {title: "Map"})
});
router.get('/geojson', function (req, res){

  var bbox = [+req.query.East,+req.query.South, +req.query.West, +req.query.North]
  datalayer.getPointsInArea(bbox, function (err, rows, fields) {
      if (!err) {
          geo = geojson.parse(rows, {Point: ['y', 'x']})
          res.send(geo)
      }
      else
          console.log('Error while performing Query: ' + err);
  });
});

module.exports = router;
