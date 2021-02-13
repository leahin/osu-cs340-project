
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/orders', function(req, res){
    var context = {'title': 'Products', 'script': 'products'};

    // TODO: sql statement goes here...
    // TODO: use loop to create an array & mapping

    // TODO: delete dummyData
    var dummyData = [
      {'id': '1', 'custId': '1', 'storeId': '1', 'orderDate': '2021-01-02'},
      {'id': '2', 'custId': '2', 'storeId': '2', 'orderDate': '2021-01-03'},
      {'id': '3', 'custId': '3', 'storeId': '3', 'orderDate': '2021-01-04'},
    ];

    context['orderList'] = dummyData;
    res.render('orders', context);
  });


  router.post('/orders', function(req, res){
    // TODO: insert INTO
  });


  router.put('/orders', function(req, res){
    // TODO: update
  });


  router.delete('/orders', function(req, res){
    // TODO: delete
  });

};
