module.exports = function(router){

  var express = require('express');
  var router = express.Router();


  var reportQuery = "SELECT abc_stores.store_id, abc_stores.store_name, abc_products.product_name, IFNULL(SUM(abc_orders_products.quantity), 0) as Total \
            FROM abc_orders_products \
            JOIN abc_orders ON abc_orders_products.oid = abc_orders.order_id \
            JOIN abc_stores ON abc_stores.store_id = abc_orders.sid \
            JOIN abc_products ON abc_products.product_id = abc_orders_products.pid \
            WHERE abc_products.product_id = 1 \
            Group BY abc_stores.store_id ASC";
// Need to change WHERE abc_products.product_id = 1 \ to the value selected in the drop down menu

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
    mysql.pool.query(reportQuery, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.stores = results;
      complete();
    });
  }

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