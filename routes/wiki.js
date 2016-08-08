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

router.get('/users/', function(req, res, next){
  User.findAll()
    .then(function(users){
      res.render('users', {users: users});
    })
})

router.get('/users/:id', function(req, res, next){
  var pagePromise = Page.findAll({ where: {authorId: req.params.id}});
  var userPromise = User.findById(req.params.id);

  Promise.all([pagePromise, userPromise])
    .then(function(promiseArray){
      res.render('singleuser', {pages: promiseArray[0], user: promiseArray[1]})
    }).catch(next)

})

router.post('/', urlencodedParser, function(req, res, next) {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`

    User.findOrCreate({
  where: {
    name: req.body.name,
    email: req.body.email
  }
})
.then(function (values) {

  var user = values[0];

  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  });

  return page.save().then(function (page) {
    return page.setAuthor(user);
  });

})
.then(function (page) {
  res.redirect(page.url);
})
.catch(next);




});

router.get('/add', function(req, res, next) {
    res.render('addpage')
});


router.get('/:pagetitle', function(req, res, next) {
    Page.findOne({
            where: {
                urlTitle: req.params.pagetitle
            },
            include: [
              {
                model: User, as: 'author'
              }
            ]
        }).then(function(page) {
            res.render('wikipage', {page: page});
        })
        .catch(next)
})





module.exports = router;
