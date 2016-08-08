var express = require('express');
var app = express();
var morgan = require('morgan');
var routes = require('./routes');
var swig = require('swig');
var database = require('./models');

app.use(morgan('tiny'));

// point res.render to the proper directory
app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn of swig's caching
swig.setDefaults({cache: false});


app.use(express.static('public'));

app.use('/', routes)

app.listen(3000);
database.Page.sync();
database.User.sync();
