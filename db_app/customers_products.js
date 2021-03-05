module.exports = function(){

  var express = require('express');
  var router = express.Router();

  var reportQuery = "SELECT abc_customers.customer_id, abc_customers.first_name, abc_customers.last_name, abc_products.product_name, \
  IFNULL(SUM(abc_orders_products.quantity), 0) as Total \
  FROM abc_orders_products \
  JOIN abc_orders ON abc_orders_products.oid = abc_orders.order_id \
  JOIN abc_customers ON abc_customers.customer_id = abc_orders.cid \
  JOIN abc_products ON abc_products.product_id = abc_orders_products.pid \
  WHERE abc_products.product_id = 1 \
  Group BY abc_customers.customer_id ASC";

// Needs Age Calculation added to getCustomer function (Current Date - Birthdate)
// WHERE abc_products.product_id = 1  needs to be changed to the age group selection.

function getCustomer(res, mysql, context, complete) {
  mysql.pool.query(reportQuery, function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.customers = results;
    complete();
  });
}

router.get('/', function (req, res) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getCustomer(res, mysql, context, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 1) {
      res.render('customers_products', context);
    }
  }
});

return router;
}();