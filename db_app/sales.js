
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/sales', function(req, res){
    var context = {'title': 'Sales', 'script': 'sales'};
    JSON.stringify(context);
    res.render('sales', context)
  });

};
