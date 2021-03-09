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

  // read sales (sales main page)
  router.get('/', (req, res) => {
    var context = {'title': 'Sales'};
    var mysql = req.app.get('mysql');

    mysql.pool.query(query, (error, results, fields) => {
      if (error){
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      };
      
      // modify the received data
      let inputList = [];
      for (i = 0; i < results.length; i++){
        let temp = {};
        let data = results[i];
        temp.store_id = data.store_id;
        temp.store_name = data.store_name;
        temp.total_sales = Number(data.total_sales).toFixed(2);
        inputList.push(temp);
      };

      context['inputList'] = inputList;
      context['filter'] = false;
      res.render('sales', context)
    })
  });

  // sales period filter
  router.post('/', (req, res) => {
    var context = {'title': 'Sales'};
    var mysql = req.app.get('mysql');
    var dateFrom = req.body.dateFrom;
    var dateTo = req.body.dateTo;

    // period validation
    if (dateFrom > dateTo) {
      res.send("Error: Invalid Sales Period");
      res.end();
    }

    mysql.pool.query(filterQuery, [dateFrom, dateTo], (error, results, fields) => {
      if (error){
        console.log(error);
        res.write(JSON.stringify(error));
        res.end();
      };

      // modify the received data
      let inputList = [];
      for (i = 0; i < results.length; i++){
        let temp = {};
        let data = results[i];
        temp.store_id = data.store_id;
        temp.store_name = data.store_name;
        temp.total_sales = Number(data.total_sales).toFixed(2);
        inputList.push(temp);
      };

      var tempDate = dateFrom.split("-");
      var startDate = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0];
      var tempDate = dateTo.split("-");
      var endDate = tempDate[1] + "/" + tempDate[2] + "/" + tempDate[0];

      context['inputList'] = inputList;
      context['filter'] = true;
      context['startDate'] = startDate;
      context['endDate'] = endDate;
      res.render('sales', context);
    });
  });

  return router;
}();
