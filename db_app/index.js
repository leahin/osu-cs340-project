
var express = require('express');
var app = express();
var router = express.Router();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', router);
app.use(express.static('../public'));

app.set('port', 3000);


// get
router.get('/', function(req, res){
  var context = {'title': 'Home', 'script': 'home'};
  res.render('home', context);
});

router.get('/stores', function(req, res){
  var context = {'title': 'Stores', 'script': 'stores'};
  res.render('stores', context);
});

router.get('/products', function(req, res){
  var context = {'title': 'Products', 'script': 'products'};
  res.render('products', context);
});

router.get('/customers', function(req, res){
  var context = {'title': 'Customers', 'script': 'customers'};
  res.render('customers', context);
});

router.get('/orders', function(req, res){
  var context = {'title': 'Orders', 'script': 'orders'};
  res.render('orders', context);
});

app.get('/add_orders', function(req, res){
  res.render('add_orders.html');
});

app.get('/orders_products', function(req, res){
  res.render('orders_products.html');
});

router.get('/sales', function(req, res){
  var context = {'title': 'Sales', 'script': 'sales'};
  res.render('sales', context)
});

router.get('/stores_products', function(req, res){
  var context = {'title': 'Stores and Prodcuts', 'script': 'stores_products'};
  res.render('stores_products', context)
});

router.get('/customers_prodcuts', function(req, res){
  var context = {'title': 'Customers and Products', 'script': 'customers_products'};
  res.render('customers_products', context)
});

// post
app.post('/', function(req, res){
  res.render('home',
);
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
