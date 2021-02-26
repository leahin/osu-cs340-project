module.exports = function(){
  var express = require('express');
  var router = express.Router();

  var getQuery = 'SELECT * FROM abc_orders ORDER BY order_id DESC';
  var searchQuery = 'SELECT * FROM abc_orders WHERE ';
  var deleteQuery = 'DELETE FROM abc_orders WHERE order_id = ?';
  var getOrderDetailsQuery = 'SELECT op.oid, op.pid, op.quantity, op.total_price FROM abc_orders_products AS op \
                            INNER JOIN abc_products AS p ON op.pid = p.product_id \
                            WHERE op.oid = ? ORDER BY op.pid';
  var insertOrder = 'INSERT INTO abc_orders (`cid`, `sid`, `order_date`) VALUES (?, ?, ?)';
  var getLastOrderId = 'SELECT order_id FROM abc_orders ORDER BY order_id DESC LIMIT 1';
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
      temp['order_date'] = year + "-" + month + "-" + date;

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
    var storeId = req.body.storeId;
    var custId = req.body.custId;
    var userInputs = [];
    var queryPartial = [];

    if (orderId.trim() !== "") {
      userInputs.push(orderId);
      queryPartial.push('order_id = ?');
    }
    if (storeId.trim() !== "") {
      userInputs.push(storeId);
      queryPartial.push('sid = ?');
    }
    if (custId.trim() !== "") {
      userInputs.push(custId);
      queryPartial.push('cid = ?');
    }

    var condition = userInputs.length;
    if (condition > 1){
      searchQuery += queryPartial.shift();
      queryPartial.forEach(q => searchQuery += " AND " + q)
    } else if (condition == 1){
      searchQuery += queryPartial[0];
    } else {
        res.send("Error: No User Inputs.")
        return;
    }

    mysql.pool.query(searchQuery, userInputs, (error, results, fields) => {
      if(error) res.send(error);
      else {
        res.render('orders', getOrderInputList(results));
        searchQuery = 'SELECT * FROM abc_orders WHERE ';
    }})
  }

  async function deleteOrder(req, res){
    var mysql = req.app.get('mysql');
    var orderId = req.body.id;

    await mysql.pool.query(deleteQuery, orderId, (error) => {
      if (error) res.send(error);
    });

    await mysql.pool.query(getQuery, (error, results, fields) => {
        res.render('orders', getOrderInputList(results))
    });
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

  async function addOrderInsert(req, res){
    var mysql = req.app.get('mysql');

    var cid = req.body.cid;
    var sid = req.body.sid;
    var order_date = req.body.orderDate;
    var pids = req.body.pid;
    var qtys = req.body.qty;

    mysql.pool.query(insertOrder, [cid, sid, order_date], (error) => {
      if (error) console.log(error);
    })

    function addOrderInsertHelper (pid, quantity) {
      mysql.pool.query(getUnitPrice, pid, (error, results, fields) => {
        if (error) console.log(error);
        var total_price = quantity * results[0].product_price;

        mysql.pool.query(getLastOrderId, (error, results, fields) => {
          if (error) console.log(error);
          var oid = results[0].order_id;

          mysql.pool.query(insertOrderProduct, [pid, oid, quantity, total_price], (error) => {
            if (error) console.log(error);
          })
        })
      })
    }

    for (i = 0; i < pids.length; i ++) {
      var pid = pids[i];
      var quantity = qtys[i];
      await addOrderInsertHelper(pid, quantity);
    }

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
