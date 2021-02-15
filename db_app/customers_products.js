
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/customers_prodcuts', function(req, res){
    var context = {'title': 'Customers and Products', 'script': 'customers_products'};
    res.render('customers_products', context)
  });

};
