var express = require('express');
var router = express.Router();
var mysql = require('mysql');


/* GET try again page. */
router.get('/tryagain', function (req, res) {
    res.render('contact', { title: 'No Results!' });
});

module.exports = router;