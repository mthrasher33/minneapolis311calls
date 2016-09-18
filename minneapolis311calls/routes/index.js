

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var geojson = require('geojson')

//database connection. where is the correct place for this?
var connection = mysql.createConnection({
    host: 'bowie2.c44css47zkdo.us-west-2.rds.amazonaws.com',
    user: 'master',
    password: 'fri$nDgramming',
    database: 'address_data'
});

//create the connection
connection.connect();

/* GET home page. */
router.get('/', function (req, res) {
  //  res.render('index', { title: 'Express' });


    connection.query('SELECT * from RentalLicense LIMIT 100', function (err, rows, fields) {
        if (!err) {

            res.render('index', { results: rows, title:'Express' });

            //  Send data to the debugger
            console.log('The solution is: ', rows);
        }
        else
            console.log('Error while performing Query: ' + err);
    });

});

/* GET about page. */
router.get('/about', function (req, res) {
    res.render('about', { title: 'About' });
});

/* GET contact page. */
router.get('/contact', function (req, res) {
    res.render('contact', { title: 'Contact' });
});
router.get('/map', function (req, res){
   res.render('map', {title: "Map"})
});
router.get('/map.geojson', function (req, res){
  connection.query('SELECT distinct round(x, 3) as x, round(y, 3) as y, subjectname from Complaint311 limit 100', function (err, rows, fields) {
      if (!err) {
          var geo
          console.log('', geo)
          geo = geojson.parse(rows, {Point: ['y', 'x']})
          res.send(geo)
      }
      else
          console.log('Error while performing Query: ' + err);
  });
});
router.get('/map/geojson', function (req, res){
  var q = '\
      SELECT distinct round(x(geom), 6) as x, round(y(geom), 6) as y, \
      subjectname from Complaint311 \
      where st_contains(st_Envelope(geomfromtext(\'LineString(? ?, ? ?)\', 4326)), geom)\
      limit 100\
      '
  console.log(q)
  var params = [+req.query.East,+req.query.South, +req.query.West, +req.query.North]
  console.log(params)
  connection.query(q, params, function (err, rows, fields) {
      if (!err) {
          geo = geojson.parse(rows, {Point: ['y', 'x']})
          res.send(geo)
      }
      else
          console.log('Error while performing Query: ' + err);
  });
});


module.exports = router;
