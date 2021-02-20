module.exports = function(){

  var express = require('express');
  var router = express.Router();

  router.get('/', function(req, res){
    var context = {'title': 'Customers', 'script': 'customers'};


    // TODO: sql statement goes here...
    // TODO: use loop to create an array & mapping

    // TODO: delete dummyData
    var dummyData = [
      {id: '1', fname: 'Emma', lname: 'Woodhouse', birthdate: '2001-01-01'},
      {id: '2', fname: 'Jack', lname: 'Tyler', birthdate: '2002-02-02'},
      {id: '3', fname: 'Jane', lname: 'Hudson', birthdate: '2003-03-03'},
    ];

    context['inputList'] = dummyData;
    JSON.stringify(context);
    res.render('customers', context);
  });


  // router.post('/customers', function(req, res){
  //   // TODO: insert INTO
  // });
  //
  //
  // router.put('/customers', function(req, res){
  //   // TODO: update
  // });
  //
  //
  // router.delete('/customers', function(req, res){
  //   // TODO: delete
  // });

  return router;
}();
