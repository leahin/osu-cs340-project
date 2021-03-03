module.exports = function(){

  var express = require('express');
  var router = express.Router();

// Needs Age Calculation added to getCustomer function (Current Date - Birthdate)

function getCustomer(res, mysql, context, complete) {
  mysql.pool.query("SELECT customer_id, first_name, last_name FROM abc_customers", function (error, results, fields) {
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