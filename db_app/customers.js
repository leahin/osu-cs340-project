module.exports = function(){

  var express = require('express');
  var router = express.Router();

  // Get Customer Data from Server
  function getCustomers(res, mysql, context, complete) {
    mysql.pool.query("SELECT customer_id, first_name, last_name, birthdate FROM abc_customers", function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.customers = results;
      complete();
    });
  }

// Route Customer Data from Server
  router.get('/', function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');

    getCustomers(res, mysql, context, complete);

    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render('customers', context);
      }

    }
  });

  // Adds a store to db

  router.post('/', function (req, res) {
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO abc_customers (first_name, last_name, birthdate) VALUES (?,?,?)";
    var inserts = [req.body.first_name, req.body.last_name, req.body.birthdate];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
      if (error) {
        console.log(JSON.stringify(error))
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/customers');
      }
    });
  });


  return router;
}();




  // router.get('/', function(req, res){
  //   var context = {'title': 'Customers', 'script': 'customers'};


    // TODO: sql statement goes here...
    // TODO: use loop to create an array & mapping

    // TODO: delete dummyData
  //   var dummyData = [
  //     {id: '1', fname: 'Emma', lname: 'Woodhouse', birthdate: '2001-01-01'},
  //     {id: '2', fname: 'Jack', lname: 'Tyler', birthdate: '2002-02-02'},
  //     {id: '3', fname: 'Jane', lname: 'Hudson', birthdate: '2003-03-03'},
  //   ];

  //   context['inputList'] = dummyData;
  //   JSON.stringify(context);
  //   res.render('customers', context);
  // });


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

