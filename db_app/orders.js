module.exports = function(){
  var express = require('express');
  var router = express.Router();

  var getQuery = 'SELECT * FROM abc_orders ORDER BY order_id DESC';
  var searchQuery = 'SELECT * FROM abc_orders WHERE order_id = ? ORDER BY order_id DESC';
  var deleteQuery = 'DELETE FROM abc_orders WHERE order_id = ?';
  var getOrderDetailsQuery = 'SELECT op.oid, op.pid, op.quantity, op.total_price FROM abc_orders_products AS op \
                            INNER JOIN abc_products AS p ON op.pid = p.product_id \
                            WHERE op.oid = ? ORDER BY op.pid';
  var insertOrder = 'INSERT INTO abc_orders (`cid`, `sid`, `order_date`) VALUES (?, ?, ?)';
  var getLastOrderId = 'SELECT order_id FROM abc_orders ORDER BY order_id DESC';
  var insertOrderProduct = 'INSERT INTO abc_orders_products (`pid`, `oid`, `quantity`, `total_price`) \
                            VALUES (?, ?, ?, ?)';
  var getUnitPrice = 'SELECT product_price FROM abc_products WHERE product_id = ?';

  function getOrderInputList(results){
    var context = {'title': 'Orders', 'jsscripts': ['scripts', 'orders']};
    var inputList = [];

    for (i = 0; i < results.length; i++) {
      var data = results[i];
      var temp = {};
      temp['order_id'] = data.order_id;
      temp['cid'] = data.cid;
      temp['sid'] = data.sid;

      raw = data.order_date;
      year = raw.getFullYear();
      month = (raw.getMonth() + 1).toString();
      if (month.length < 2){
        month = '0' + month;
      };
      date = raw.getDate().toString();
      if (date.length < 2){
        date = '0' + date;
      };
      temp['order_date'] = month + "/" + date + "/" + year;

      inputList.push(temp)
    };

    context['inputList'] = inputList;
    JSON.stringify(context)

    return context;
  }

  function getOrders(req, res){
    var mysql = req.app.get('mysql');

    mysql.pool.query(getQuery, (error, results, fields) => {
      res.render('orders', getOrderInputList(results))
    })
  }

  function searchOrder(req, res){
    var mysql = req.app.get('mysql');
    var orderId = req.body.orderId;

    mysql.pool.query(searchQuery, orderId, (error, results, fields) => {
      res.render('orders', getOrderInputList(results))
    })
  }

  function deleteOrder(req, res){
    var mysql = req.app.get('mysql');
    var orderId = req.body.id;

    mysql.pool.query(deleteQuery, orderId, (error, results, fields) =>{
      mysql.pool.query(getQuery, (error, results,fields) =>{
        res.render('orders', getOrderInputList(results))
      })
    })
  }

  function getOrderDetails(req, res){
    var mysql = req.app.get('mysql');
    var orderId = req.params.id;

    var context = {'title': 'Order Details: ' + orderId, 'jsscripts': ['scripts', 'orders_products']};
    function renderOrderDetails(err, rows, fields){
      JSON.stringify(rows)
      var inputList = [];
      for(i = 0; i < rows.length; i++){
        data = rows[i];
        temp = {};
        temp['id'] = data['order_id'];
        temp['prodId'] = data['pid'];
        temp['qty'] = data['quantity'];
        temp['total_price'] = data['total_price'];
        inputList.push(temp);
      }
      var grandTotal = 0;
      for (j = 0; j < inputList.length; j++){
        grandTotal = grandTotal + inputList[j]['total_price'];
      }
      context['inputList'] = inputList;
      context['grandTotal'] = grandTotal.toFixed(2);
      context['orderId'] = orderId;
      context['layout'] = 'noNav.handlebars';
      res.render('order_details', context);
    }
    mysql.pool.query(getOrderDetailsQuery, orderId, renderOrderDetails)
  }

  function addOrderView(req, res){
    var context = {'title': 'Add Order', 'jsscripts': ['scripts', 'add_order']};
    context['layout'] = 'noNav.handlebars';

    res.render('add_order', context);
  }

  function addOrderInsert(req, res){
    var mysql = req.app.get('mysql');
    var cid = req.body.cid;
    var sid = req.body.sid;
    var order_date = req.body.orderDate;
    var pids = req.body.pid;
    var qtys = req.body.qty;

    mysql.pool.query(insertOrder, [cid, sid, order_date]);
    mysql.pool.query(getLastOrderId, (error, results, fields) => {
      var oid = results[0].order_id;

      function addOrderProduct(pid, quantity){
        mysql.pool.query(getUnitPrice, pid, (error, results, fields) =>{
          var total_price = quantity*results[0].product_price;
          mysql.pool.query(insertOrderProduct, [pid, oid, quantity, total_price], (error) =>{
            if(error) console.log(error);
          })
        })
      }

      for (i = 0; i < pids.length; i++){
        var pid = pids[i];
        var quantity = qtys[i];
        addOrderProduct(pid, quantity);
      };
    });
    res.redirect('/add_order');
  }

  router.get('/', getOrders)
  router.post('/', searchOrder)
  router.delete('/', deleteOrder)
  router.get('/add_order', addOrderView)
  router.post('/add_order', addOrderInsert)
  router.get('/order_details/:id', getOrderDetails)

  return router;
}();
