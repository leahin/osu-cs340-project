
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/products', function(req, res){
    var context = {'title': 'Products', 'script': 'products'};

    // TODO: sql statement goes here...
    // TODO: use loop to create an array & mapping

    // TODO: delete dummyData
    var dummyData = [
      [1, 'Bubble', 29.99],
      [2, 'Puffs', 29.99],
      [3, 'Productify', 39.99],
      [4, 'Prodcutjet', 39.99],
      [5, 'Microzen', 69.99],
      [6, 'Microcog', 79.99],
      [7, 'Reboot Link', 80.25],
      [8, 'Repair Link', 85.25],
      [9, 'Jam', 45.50],
      [10, 'Data', 40.75]
    ];

    var inputList = [];
    for (i = dummyData.length - 1; i > -1; i--) {
      temp = {};
      data = dummyData[i];
      temp['id'] = data[0];
      temp['name'] = data[1];
      temp['price'] = data[2].toFixed(2);
      inputList.push(temp);
    }
    context['inputList'] = inputList;
    JSON.stringify(context);
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
