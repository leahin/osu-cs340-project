
var express = require('express');
var router = express.Router();

module.exports = function(router){

  router.get('/stores', function(req, res){
    var context = {'title': 'Stores', 'script': 'stores'};


    // TODO: sql statement goes here...
    // TODO: use loop to create an array & mapping

    // TODO: delete dummyData
    var dummyData = [
      {'id': '1', 'name': 'Store 1', 'address': '1111 Store St.', 'state': 'OR', 'zipcode': '99999'},
      {'id': '2', 'name': 'Store 2', 'address': '2222 Store St.', 'state': 'OR', 'zipcode': '99999'},
      {'id': '3', 'name': 'Store 3', 'address': '3333 Store St.', 'state': 'OR', 'zipcode': '99999'},
    ];

    context['storeList'] = dummyData;
    JSON.stringify(context);
    res.render('stores', context);
  });


  router.post('/stores', function(req, res){
    // TODO: insert INTO
  });


  router.put('/stores', function(req, res){
    // TODO: update
  });


  router.delete('/stores', function(req, res){
    // TODO: delete
  });

};
