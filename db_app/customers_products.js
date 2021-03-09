module.exports = function(){

  var express = require('express');
  var router = express.Router();

  var initAgeGroup = [20, 29]  //  initial age group to be displayed

  /* reportQuery: TIMESTAMPDIFF(YEAR, c.birthdate, CURDATE()) AS age
    Date: 3/9/21
    Copied & modified from
    Source URL: https://stackoverflow.com/questions/5773405/calculate-age-in-mysql-innodb
  */
  var reportQuery = "SELECT p.product_id, p.product_name, IFNULL(SUM(op.quantity), 0) AS total, \
    IFNULL(SUM(op.total_price), 0) AS total_price FROM \
      (SELECT c.customer_id, c.first_name, TIMESTAMPDIFF (YEAR, c.birthdate, CURDATE()) AS age \
        FROM abc_customers AS c HAVING age >= ? AND age <= ?) AS tempc \
    INNER JOIN abc_orders AS o ON tempc.customer_id = o.cid \
    INNER JOIN abc_orders_products AS op ON o.order_id = op.oid \
    INNER JOIN abc_products AS p ON op.pid = p.product_id \
    GROUP BY p.product_id ORDER BY total DESC"


// Read/Search helper function get data by reportQuery.
function getCustomer(res, mysql, context, complete, ageGroup) {
  mysql.pool.query(reportQuery, ageGroup, function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    // context ageGroup selector
    if (ageGroup[0] == 0) {
      context.ageGroup = "Under 20";
    } else if (ageGroup[0] == 70) {
      context.ageGroup = "Over 70"
    } else {
      context.ageGroup = ageGroup[0] + "-" + ageGroup[1];
    }
    // modifying data received
    let customers = [];
    for (i = 0; i < results.length; i++) {
      let temp = {};
      let data = results[i];
      temp['product_id'] = data.product_id;
      temp['product_name'] = data.product_name;
      temp['total'] = data.total;
      temp['total_price'] = data.total_price.toFixed(2);
      customers.push(temp);
    }
    context.customers = customers;
    complete();
  });
}

// Read router to show the initial Age Group.
router.get('/', function (req, res) {
  var callbackCount = 0;
  var context = {'title': 'Customers and Products'};
  var mysql = req.app.get('mysql');
  getCustomer(res, mysql, context, complete, initAgeGroup);
  function complete() {
    callbackCount++;
    if (callbackCount >= 1) {
      res.render('customers_products', context);
    }
  }
});

// Search Router, show a selected age group.
router.post('/', function (req, res) {
  var callbackCount = 0;
  var context = {'title': 'Customers and Products'};
  var mysql = req.app.get('mysql');
  let ageGroup = req.body.ageGroup.split(",");
  getCustomer(res, mysql, context, complete, ageGroup);
  function complete() {
    callbackCount++;
    if (callbackCount >= 1) {
      res.render('customers_products', context);
    }
  }
});

return router;
}();
