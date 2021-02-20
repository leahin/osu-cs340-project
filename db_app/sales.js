module.exports = function(router){
  var express = require('express');
  var router = express.Router();

  router.get('/', (req, res) => {
    var context = {'title': 'Sales', 'jsscript': 'sales'};
    var mysql = req.app.get('mysql');
    var query = 'SELECT s.store_id, s.store_name, SUM(op.total_price) AS total_sales FROM abc_orders_products AS op \
                  INNER JOIN abc_orders AS o ON op.oid = o.order_id \
                  INNER JOIN abc_stores AS s ON o.sid = s.store_id \
                  GROUP BY s.store_id \
                  ORDER BY total_sales DESC';

    mysql.pool.query(query, (error, results, fields) => {
      JSON.stringify(results);
      var inputList = [];
      for (i = 0; i < results.length; i++){
        var data = results[i];
        var temp = {};
        temp['store_id'] = data.store_id;
        temp['store_name'] = data.store_name;
        temp['total_sales'] = data.total_sales;
        inputList.push(temp);
      }
      context['inputList'] = inputList;
      JSON.stringify(context);
      res.render('sales', context)
    })
  });

  return router;
}();
