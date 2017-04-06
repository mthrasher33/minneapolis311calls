var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var datalayer = require('../data/datalayer.js');
var config = require('../config')['production'];
var wordpress = require( 'wordpress' );

/* GET home page. */
router.get('/', function (req, res) {

    datalayer.getTopRentalLicenses(function (err, rows, fields) {
        if (!err) {
            res.render('index', { results: rows, title: 'Rental Researcher', path: req.path });
            console.log(req.path);
        }
        else
            console.log('Error while performing Query: ' + err);
    });
});

/*GET autocomplte for home page search*/
router.get('/search', function (req, res) {
    //console.log("SEARCHING");
    datalayer.matchPartialAddress(req.query.key, function (err, rows, fields) {
        if (err) throw err;
        var data = [];
        console.log(req.query.key);
        for (i = 0; i < rows.length; i++) {
            data.push(rows[i].Address);
        }
        res.end(JSON.stringify(data));
    });
});

/*POST to check if user input is in database*/
router.post('/check', function (req, res) {
    console.log("POST METHOD:");
    console.log(req.body.typeahead) //returns what the user typed in the box

    //connect to database and search the input in the address column
    datalayer.matchAddressDistinct(req.body.typeahead, function (err, rows, fields) {
        console.log("Querying the database...");
        console.log("number of rows returned:");
        console.log(rows.length);
        for (var i = 0; i < rows.length; i++) {
            console.log(rows[i]);
        };
        if (err) {
            throw err;
        }

        //if there is an exact match, route there (1408 Monroe St. NE)
        //if there is one partial match, route there (1408 Monroe --> 1408 Monroe St. NE)
        else if (rows.length === 1) {
            res.redirect('/addressSearch/' + encodeURIComponent(rows[0].Address));
        }

        //if no partial match, display a list of all possibilites (14 --> 1408 Monroe St. NE, 1424 Madison St. NE, etc.)
        else if (rows.length > 1) {
            res.render('addressSearchDidYouMean', { results: rows, addressSearched: req.body.typeahead,  title: "Search Suggestions"}); //send to the did you mean page?
        }

        //if we have nothing, display a sorry message and allow them to link back to the search box
        else {            
            res.render('addressSearch404', { title: 'No Results', addressSearched: req.body.typeahead });
        };

   

    });
});
/* GET about page. */
router.get('/about', function (req, res) {
    res.render('about', { title: 'About', path: req.path });
    console.log(req.path);
});

/* GET contact page. */
router.get('/contact', function (req, res) {
    res.render('contact', { title: 'Contact', path: req.path });
    console.log(req.path);
});

router.get('/blog', function(req,res){

    var client = wordpress.createClient({
        url: "https://snellslaw.wordpress.com",
        username: "matthew.j.thrasher@gmail.com",
        password: config.wordpressPassword
    });

    client.getPosts(function(error, posts){
        if(!error){
            res.render('blog', { title: 'Blog', path: req.path, posts: posts});
            console.log(posts);

        } else {
            res.render('blog', { title: 'Blog', path: req.path});
            console.log(error);
        }

    });

});

router.get('/blog/:postID', function(req,res){

    var postID = req.params.postID;
       var client = wordpress.createClient({
        url: "https://snellslaw.wordpress.com",
        username: "matthew.j.thrasher@gmail.com",
        password: config.wordpressPassword
    });

    client.getPost(postID, function(error, post){
        if(!error){
            res.render('blogarticle', { title: post.title, path: req.path, post: post});
            console.log(post);

        } else {
            res.render('blogarticle', { title: 'Blog', path: req.path});
            console.log(error);
        }

    }); 
})

/*POST contact page (for sending emails)*/
/*Source for this: https://blog.ragingflame.co.za/2012/6/28/simple-form-handling-with-express-and-nodemailer*/
router.post('/contact', function(req,res){
    var mailOpts, smtpTrans;

    smtpTrans = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: "rentalresearcher@gmail.com",
            pass: config.contactUsEmailPassword
        }
    });

    mailOpts = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;',
        to: 'rentalresearcher@gmail.com',
        subject: '311 Minneapolis Inquiry from ' + req.body.name + " at " + req.body.email,
        text: req.body.message
    };

    smtpTrans.sendMail(mailOpts, function(error, response){
        if(!error){
            console.log('email sent to: ' + mailOpts.to);
            console.log('with this content: ' + mailOpts.text);
            res.render('contact', {msg: 'Success'});
        } else {
            console.log(error);
        }
    });

});

/*Allow robots to crawl the site*/
router.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *");
});

module.exports = router;