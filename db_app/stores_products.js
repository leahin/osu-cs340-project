module.exports = function(router){
  var express = require('express');
  var router = express.Router();

  var initProductId = 1;  // product_id initially shown on the page.

  var reportQuery = "SELECT s.store_id, s.store_name, p.product_id, p.product_name, IFNULL(SUM(op.quantity), 0) as total \
            FROM abc_stores AS s \
            INNER JOIN abc_orders AS o ON s.store_id = o.sid \
            INNER JOIN abc_orders_products AS op ON o.order_id = op.oid \
            INNER JOIN abc_products AS p ON op.pid = p.product_id \
            WHERE product_id = ? \
            GROUP BY s.store_id ORDER BY total DESC";

  var productQuery = "SELECT product_id, product_name FROM abc_products";

  //Build dropdown filter get data to show the Products that are the database
  function getProducts(res, mysql, context, complete) {
    mysql.pool.query(productQuery, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.products = results;
      complete();
    });
  }

  // Get Data for table to show Store ID, Store Name, Product, Quantity Sold
  function getStores(res, mysql, context, complete, product_id) {
    mysql.pool.query(reportQuery, product_id, function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.stores = results;
      context.product_name = results[0].product_name;
      complete();
    });
  }

  // the main page of stores and products. show product_id = 1
  router.get('/', function (req, res) {
    var callbackCount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getStores(res, mysql, context, complete, initProductId);
    getProducts(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render('stores_products', context);
      };
    };
  });

  // stores and products filter.
  router.post('/', function (req, res) {
    var callbackCount = 0;
    var context = {};
    let product_id = req.body.storeProd;
    var mysql = req.app.get('mysql');
    getStores(res, mysql, context, complete, product_id);
    getProducts(res, mysql, context, complete);
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render('stores_products', context);
      }
    };
  })

  return router;
}();
