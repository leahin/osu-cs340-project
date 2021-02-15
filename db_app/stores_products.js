
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/stores_products', function(req, res){
    var context = {'title': 'Stores and Prodcuts', 'script': 'stores_products'};
    JSON.stringify(context);
    res.render('stores_products', context)
  });

};
