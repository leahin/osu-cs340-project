module.exports = function(router){

  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res){
    var context = {'title': 'Stores and Prodcuts', 'script': 'stores_products'};
    JSON.stringify(context);
    res.render('stores_products', context)
  });

  return router;
}();
