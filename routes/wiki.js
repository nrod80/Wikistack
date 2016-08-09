// npm dependencies
var express = require('express');
var bodyParser = require('body-parser');

//our dependencies
var models = require('../models');

var router = express.Router();
var Page = models.Page;
var User = models.User;


var urlencodedParser = bodyParser.urlencoded({
    extended: false
})

function getPage(name) {
    return {
        where: {
            urlTitle: name
        },
        include: [{
            model: User,
            as: 'author'
        }]
    }
}

function findAuthorId(req) {
    return {
        where: {
            authorId: req.params.id
        }
    }
}

function findOrCreateUser(req) {
    return {
        where: {
            name: req.body.name,
            email: req.body.email
        }
    }
}


router.get('/', function(req, res, next) {
    Page.findAll()
        .then(function(pages) {
            res.render('index', {
                pages: pages
            })
        })
});

router.get('/users/', function(req, res, next) {
    User.findAll()
        .then(function(users) {
            res.render('users', {
                users: users
            });
        })
})

router.get('/users/:id', function(req, res, next) {
    var pagePromise = Page.findAll(findAuthorId(req));
    var userPromise = User.findById(req.params.id);

    Promise.all([pagePromise, userPromise])
        .then(function(promiseArray) {
            res.render('singleuser', {
                pages: promiseArray[0],
                user: promiseArray[1]
            })
        }).catch(next)

})

router.post('/', urlencodedParser, function(req, res, next) {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`

    User.findOrCreate(findOrCreateUser(req))
        .then(function(values) {

            var user = values[0];
            var tagsToPass = req.body.tags.split(', ')
            var page = Page.build({
                title: req.body.title,
                content: req.body.content,
                tags: tagsToPass
            });

            return page.save().then(function(page) {
                return page.setAuthor(user);
            });

        })
        .then(function(page) {
            res.redirect(page.url);
        })
        .catch(next);




});

router.get('/add', function(req, res, next) {
    res.render('addpage')
});

router.get('/search', urlencodedParser, function(req, res, next) {
    var tagsToFind = req.query.tag.replace(/\s+/g,'').split(',');
    var test = Page.findAll({
        where: {
            tags: {
                $overlap: tagsToFind
            }
        }
    }).then(function(pages) {
        console.log(pages);
        res.render('index', {
            pages: pages
        })
    })
})


router.get('/:pagetitle', function(req, res, next) {
    Page.findOne(getPage(req.params.pagetitle))
        .then(function(page) {
            //console.log(page);
            res.render('wikipage', {
                page: page
            });
        })
        .catch(next)
})

router.get('/:pagetitle/delete', function(req, res, next) {
    Page.findOne(getPage(req.params.pagetitle))
        .then(function(page) {
            res.render('deletetags', {
                page: page
            });
        })
        .catch(next)
})

router.post('/:pagetitle/delete', urlencodedParser, function(req, res, next) {
    Page.findOne(getPage(req.params.pagetitle))
        .then(function(page) {
            var theTags = page.dataValues.tags;
            for (var key in req.body) {
                theTags.splice(key, 1)
            }
            page.update({
                tags: theTags,
                where: {
                    urltitle: req.params.pagetitle
                }
            })
            res.render('wikipage', {
                page: page
            });
        })
        .catch(next);
})






module.exports = router;
