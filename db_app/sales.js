module.exports = function(router){
  var express = require('express');
  var router = express.Router();

  var query = 'SELECT s.store_id, s.store_name, SUM(op.total_price) AS total_sales FROM abc_orders_products AS op \
                INNER JOIN abc_orders AS o ON op.oid = o.order_id \
                INNER JOIN abc_stores AS s ON o.sid = s.store_id \
                GROUP BY s.store_id \
                ORDER BY total_sales DESC';
  var filterQuery = 'SELECT s.store_id, s.store_name, SUM(op.total_price) AS total_sales FROM abc_orders_products AS op \
                INNER JOIN abc_orders AS o ON op.oid = o.order_id \
                INNER JOIN abc_stores AS s ON o.sid = s.store_id \
                WHERE o.order_date BETWEEN ? AND ? \
                GROUP BY s.store_id \
                ORDER BY total_sales DESC';

  // READ SALES (sales main page)
  router.get('/', (req, res) => {
    var context = {'title': 'Sales', 'jsscripts': 'sales'};
    var mysql = req.app.get('mysql');

    mysql.pool.query(query, (error, results, fields) => {
      if (error){
        console.log(error);
        res.send(error);
        return;
      };
      JSON.stringify(results);
      // console.log(results);
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
      context['filter'] = false;
      // console.log(context);
      JSON.stringify(context);
      res.render('sales', context)
    })
  });

  // FILTER SALES
  router.post('/', (req, res) => {
    var context = {'title': 'Sales', 'jsscripts': 'sales'};
    var mysql = req.app.get('mysql');
    var dateFrom = req.body.dateFrom;
    var dateTo = req.body.dateTo;

    // period validation
    if (dateFrom > dateTo) {
      res.send("Error: Invalid Sales Period");
      return;
    }

    mysql.pool.query(filterQuery, [dateFrom, dateTo], (error, results, fields) => {
      if (error){
        console.log(error);
        res.send(error);
        return;
      };
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

      var tempDate = dateFrom.split("-");
      var startDate = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0];
      var tempDate = dateTo.split("-");
      var endDate = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0];

      context['filter'] = true;
      context['startDate'] = startDate;
      context['endDate'] = endDate;
      context['inputList'] = inputList;
      JSON.stringify(context);
      res.render('sales', context);
    });
  });

  return router;
}();
