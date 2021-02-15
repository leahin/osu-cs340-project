
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/stores_products', function(req, res){
    var context = {'title': 'Stores and Prodcuts', 'script': 'stores_products'};
    res.render('stores_products', context)
  });

};
