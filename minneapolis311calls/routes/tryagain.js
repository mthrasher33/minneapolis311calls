var express = require('express');
var router = express.Router();

/* GET try again page. */
router.get('/tryagain', function (req, res) {
    res.render('contact', { title: 'No Results!' });
});

module.exports = router;