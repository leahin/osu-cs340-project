
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/products', function(req, res){
    var context = {'title': 'Products', 'script': 'products'};

    // TODO: sql statement goes here...
    // TODO: use loop to create an array & mapping

    // TODO: delete dummyData
    var dummyData = [
      {'id': '1', 'name': 'Product A', 'price': '19.99', 'type': 'Type A'},
      {'id': '2', 'name': 'Product B', 'price': '29.99', 'type': 'Type B'},
      {'id': '3', 'name': 'Product C', 'price': '39.99', 'type': 'Type C'},
      {'id': '4', 'name': 'Product D', 'price': '49.99', 'type': 'Type D'},
      {'id': '5', 'name': 'Product E', 'price': '59.99', 'type': 'Type E'}
    ];

    context['productList'] = dummyData;
    res.render('products', context);
  });


  router.post('/products', function(req, res){
    // TODO: insert INTO
  });


  router.put('/products', function(req, res){
    // TODO: update
  });


  router.delete('/products', function(req, res){
    // TODO: delete
  });

};
