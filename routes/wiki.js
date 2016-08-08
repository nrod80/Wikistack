var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var models = require('../models');
var Page = models.Page;
var User = models.User;


var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

router.get('/', function(req, res, next) {
    Page.findAll()
    .then(function(pages){
      res.render('index', {pages: pages})
    })
});

router.post('/', urlencodedParser, function(req, res, next) {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`
    var page = Page.build({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
    });

    // STUDENT ASSIGNMENT:
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise or it can take a callback.
    page.save()
        .then(function(savedPage){
          res.redirect(savedPage.url) // route virtual FTW
        }).catch(next);




});

router.get('/add', function(req, res, next) {
    res.render('addpage')
});


router.get('/:pagetitle', function(req, res, next) {
    Page.findOne({
            where: {
                urlTitle: req.params.pagetitle
            }
        })
        .then(function(output) {
            console.log(output);
            res.render('wikipage', output.dataValues);
        })
        .catch(next)
})





module.exports = router;
