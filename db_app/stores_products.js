module.exports = function(router){

  var express = require('express');
  var router = express.Router();

// NEED to Inner Join Stores with Orders and then take the sum of all quantities of each products for each store.

  function getProducts(res, mysql, context, complete) {
    mysql.pool.query("SELECT product_id, product_name FROM abc_products", function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.products = results;
      complete();
    });
  }

  function getStores(res, mysql, context, complete) {
    mysql.pool.query("SELECT store_id, store_name FROM abc_stores", function (error, results, fields) {
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
    getProducts(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render('stores_products', context);
      }
    }
  });

  return router;
}();