module.exports = function(){
  var express = require('express');
  var router = express.Router();

  //router.get('/', function(req, res){
   // var context = {'title': 'Stores', 'script': 'stores'};

// Get Store Data from DB

  function getStores(res, mysql, context, complete) {
    mysql.pool.query("SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores", function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.stores = results;
      complete();
    });
  }

// Route Store Data from DB

  router.get('/', function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');

    getStores(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render('stores', context);
      }

    }
  });

  // Adds a store to db

  router.post('/', function (req, res) {
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO abc_stores (store_name, street_address, state, zip_code) VALUES (?,?,?,?)";
    var inserts = [req.body.store_name, req.body.street_address, req.body.state, req.body.zip_code];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error))
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/stores');
      }
    });
  });

  //   var dummyData = [
  //     {id: '1', name: 'Store 1', address: '1111 Store St.', state: 'OR', zipcode: '99999'},
  //     {id: '2', name: 'Store 2', address: '2222 Store St.', state: 'OR', zipcode: '99999'},
  //     {id: '3', name: 'Store 3', address: '3333 Store St.', state: 'OR', zipcode: '99999'},
  //     {id: '3', name: 'Store 345', address: '1231 Store St.', state: 'OR', zipcode: '99999'},
  //     {id: '3', name: 'Store 345', address: '1231 Store St.', state: 'OR', zipcode: '99999'},

  //   ];

  //   context['inputList'] = dummyData;
  //   JSON.stringify(context);
  //   res.render('stores', context);
  // });


  // router.post('/stores', function(req, res){
  //   // TODO: insert INTO
  // });
  //
  //
  // router.put('/stores', function(req, res){
  //   // TODO: update
  // });
  //
  //
  // router.delete('/stores', function(req, res){
  //   // TODO: delete
  // });

  return router;
}();
