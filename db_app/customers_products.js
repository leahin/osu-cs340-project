module.exports = function(){

  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res){
    var context = {'title': 'Customers and Products', 'script': 'customers_products'};
    JSON.stringify(context);
    res.render('customers_products', context)
  });

  return router;
}();
