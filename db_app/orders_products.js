module.exports = function(){
  var express = require('express');
  var router = express.Router();

  var getQuery = 'SELECT * FROM abc_orders_products ORDER BY oid';

  // READ ORDERS_PRODUCTS for debug.
  function getOrdersProducts(req, res){
    var mysql = req.app.get('mysql');

    mysql.pool.query(getQuery, (error, results, fields) => {
      if (error) {
        console.log("DB getOrdersProducts Error: " + error);
        res.send(error);
        return;
      }
      var context = {'title': 'READ Orders_Products for Debug', 'jsscripts': ['scripts']};
      var inputList = [];

      for (i = 0; i < results.length; i++) {
        var data = results[i];
        var temp = {};
        temp['oid'] = data.oid;
        temp['pid'] = data.pid;
        temp['qty'] = data.quantity;
        temp['total_price'] = data.total_price.toFixed(2);

        inputList.push(temp);
      };

      context['inputList'] = inputList;
      JSON.stringify(context);

      res.render('orders_products', context);
    });
  };

  router.get('/', getOrdersProducts)
  return router;
}();
