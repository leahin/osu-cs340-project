var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require('path');
var mysql = require('./dbcon.js');

var app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('mysql', mysql);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// app port
app.set('port', 7892);
app.listen(app.get('port'), function() {
  console.log(
    `Express started on http://${process.env.HOSTNAME}:${app.get('port')};
     press Ctrl-C to terminate.`);
});

app.use('/stores', require('./stores'));
app.use('/products', require('./products'));
app.use('/orders', require('./orders'));
app.use('/customers', require('./customers'));
app.use('/sales', require('./sales'));
app.use('/stores_products', require('./stores_products'));
app.use('/customers_products', require('./customers_products'));
app.use(express.static('../public'));

app.get('/', function(req, res){
  var context = {'title': 'Home', 'jsscripts': ['scripts', 'home']};
  res.render('home', context);
});

app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});
