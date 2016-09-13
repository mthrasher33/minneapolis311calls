var express = require('express');
var router = express.Router();

//Get Address Search Results, curently just searching by DB id for simplicity
router.get('/:addressId', function (req, res) {
    res.render('addressSearch', { addressId: req.params.addressId });
});

module.exports = router;