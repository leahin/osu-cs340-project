module.exports = function () {
  var express = require('express');
  var router = express.Router();


  function getSearchStore(req,res,mysql,context,complete){
    var sql = "SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores WHERE concat(store_name, state) = ?"
    var inserts = [req.params.name];
    console.log(inserts);
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        console.log(results);

        context.stores = results;
        complete();
    })
}



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


  router.get('/search/:name', function(req,res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["searchStores.js"];
    console.log(context);
    var mysql = req.app.get('mysql');
    getSearchStore(req,res,mysql, context,complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('/stores', context);
        }
    }

})





  return router;
}();