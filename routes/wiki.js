var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.post('/', urlencodedParser, function(req, res, next) {
  console.log(req.body);
  res.send('adsf');
});

router.get('/add', function(req, res, next) {
  res.render('addpage')
});




module.exports = router;
