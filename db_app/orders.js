
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/orders', function(req, res){
    var context = {'title': 'Orders', 'script': 'orders'};

    // TODO: sql statement goes here...
    // TODO: use loop to create an array & mapping

    // TODO: delete dummyData
    var dummyData = [
      [1, 8, 1, '2019-05-07'],
      [2, 7, 2, '2019-06-08'],
      [3, 6, 3, '2019-06-08'],
      [4, 5, 4, '2019-07-12'],
      [5, 4, 5, '2019-08-31'],
      [6, 3, 6, '2020-01-05'],
      [7, 2, 7, '2020-03-15'],
      [8, 1, 8, '2021-01-10'],
      [9, 2, 7, '2021-01-28'],
      [10, 1, 8, '2021-02-10']
    ];

    var inputList = [];
    for (i = dummyData.length - 1; i > -1; i--) {
      temp = {};
      data = dummyData[i];
      temp['id'] = data[0];
      temp['custId'] = data[1];
      temp['storeId'] = data[2];
      temp['orderDate'] = data[3];
      inputList.push(temp);
    }
    context['inputList'] = inputList;
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
