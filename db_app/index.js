
var express = require('express');
var app = express();
var router = express.Router();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require('path');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', router);
require('./stores')(router);
require('./products')(router);
require('./customers')(router);
require('./orders')(router);
require('./sales')(router);
require('./stores_products')(router);
require('./customers_products')(router);
app.use(express.static('../public'));

app.set('port', 7892);


// routers
router.get('/', function(req, res){
  var context = {'title': 'Home', 'script': 'home'};
  JSON.stringify(context);
  res.render('home', context);
});

// app.get('/add_orders', function(req, res){
//   res.render('add_orders.html');
// });
//
// app.get('/orders_products', function(req, res){
//   res.sendFile(path.join(__dirname + '/orders_products.html'));
// });


// post
app.post('/', function(req, res){
  res.render('home');
});



// error handlers
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


// listen
app.listen(app.get('port'), function() {
  console.log(
    `Express started on http://${process.env.HOSTNAME}:${app.get('port')};
     press Ctrl-C to terminate.`);
});
