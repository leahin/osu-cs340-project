module.exports = function(){
  var express = require('express');
  var router = express.Router();

  // READ/UPDATE/DELETE queries for Orders
  var getQuery = 'SELECT * FROM abc_orders ORDER BY order_id DESC';
  var searchQuery = 'SELECT * FROM abc_orders WHERE ';
  var updateQuery = 'UPDATE abc_orders SET cid = ?, sid = ?, order_date = ? WHERE order_id = ?';
  var deleteQuery = 'DELETE FROM abc_orders WHERE order_id = ?';

  var storeQuery = 'SELECT store_id, store_name FROM abc_stores';
  var customerQuery = 'SELECT * FROM abc_customers';
  var productQuery = 'SELECT * FROM abc_products';
  var searchProductQuery = productQuery + ' WHERE product_id = ?';

  // READ/ADD queries for Orders and Orders_Products
  var insertOrder = 'INSERT INTO abc_orders (`cid`, `sid`, `order_date`) VALUES (?, ?, ?)';
  var getLastOrderId = 'SELECT order_id FROM abc_orders ORDER BY order_id DESC LIMIT 1';
  var insertOrderProduct = 'INSERT INTO abc_orders_products (`pid`, `oid`, `quantity`, `total_price`) \
                            VALUES (?, ?, ?, ?)';
  var getUnitPrice = 'SELECT product_price FROM abc_products WHERE product_id = ?';

  var getOrderDetailsQuery = 'SELECT op.oid, op.pid, p.product_name, op.quantity, op.total_price FROM abc_orders_products AS op \
                            INNER JOIN abc_products as p ON op.pid = p.product_id \
                            WHERE op.oid = ? ORDER BY op.pid';

  // READ ORDERS helper function
  function getOrderInputList(results){
    var context = {'title': 'Orders', 'jsscripts': ['scripts', 'orders']};
    var inputList = [];

    for (i = 0; i < results.length; i++) {
      var data = results[i];
      var temp = {};
      temp['order_id'] = data.order_id;

      // Check Null values for cid and sid
      if (data.cid === null) {
        temp['cid'] = 'Not Available';
      } else {
        temp['cid'] = data.cid;
      };
      if (data.sid === null) {
        temp['sid'] = 'Not Available';
      } else {
        temp['sid'] = data.sid;
      };

      // Format date
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

      inputList.push(temp);
    };

    context['inputList'] = inputList;
    return context;
  }

  // READ ORDERS
  function getOrders(req, res){
    var mysql = req.app.get('mysql');

    mysql.pool.query(getQuery, (error, results, fields) => {
      if (error){
        console.log(error);
        res.send(error);
        return;
      };
        res.render('orders', getOrderInputList(results));
      });
  }

  // FILTER ORDERS
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
    };
    if (storeId.trim() !== "") {
      userInputs.push(storeId);
      queryPartial.push('sid = ?');
    };
    if (custId.trim() !== "") {
      userInputs.push(custId);
      queryPartial.push('cid = ?');
    };

    var condition = userInputs.length;
    if (condition > 1){
      searchQuery += queryPartial.shift();
      queryPartial.forEach(q => searchQuery += " AND " + q)
    } else if (condition == 1){
      searchQuery += queryPartial[0];
    } else {
        res.redirect('/orders');
        return;
    };

    mysql.pool.query(searchQuery, userInputs, (error, results, fields) => {
      if(error) {
        console.log(error);
        res.send(error);
        return;
      };
      res.render('orders', getOrderInputList(results));
      searchQuery = 'SELECT * FROM abc_orders WHERE ';
    })
  }

  // UPDATE ORDERS
  async function updateOrder(req, res){
    var mysql = req.app.get('mysql');
    var orderId = req.body.order_id;
    var cid = req.body.cid;
    var sid = req.body.sid;
    var orderDate = req.body.order_date;

    await mysql.pool.query(updateQuery,[cid, sid, orderDate, orderId], (error)=>{
      if (error) {
        console.log(error);
        res.send(error);
        return;
      }
      res.redirect('/orders');
    });
  }

  // DELETE ORDERS
  function deleteOrder(req, res){
    var mysql = req.app.get('mysql');
    var orderId = req.body.id;

    mysql.pool.query(deleteQuery, orderId, (error) => {
      if (error) {
        console.log(error);
        res.send(error);
        return;
      }
      res.redirect('/orders');
    });
  }

  // ADD ORDERS - new window view
  function addOrderView(req, res){
    var mysql = req.app.get('mysql');
    var context = {'title': 'Add Order', 'jsscripts': ['scripts', 'add_order']};
    context['layout'] = 'noNav.handlebars';

    // dropdown menu
    // get stores
    mysql.pool.query(storeQuery, (error, results, fields) => {
      if (error){
        console.log("StoreQuery Error: " + error);
        res.send("StoreQuery Error:" + error);
        return;
      }
      context['storeList'] = results;
      // get customers
      mysql.pool.query(customerQuery, (error, results, fields) => {
        if (error){
          console.log("StoreQuery Error: " + error);
          res.send("StoreQuery Error:" + error);
          return;
        }
        context['customerList'] = results;
        res.render('add_order', context);
      });
    });
  }

  // ADD ORDERS and ORDERS_PRODUCTS
  async function addOrderInsert(req, res){
    var mysql = req.app.get('mysql');
    var context = {'title': 'Add Order', 'jsscripts': ['scripts', 'add_order']};

    var cid = req.body.cid;
    var sid = req.body.sid;
    var order_date = req.body.orderDate;
    var pids = req.body.pid;
    var qtys = req.body.qty;

    // add Orders first
    mysql.pool.query(insertOrder, [cid, sid, order_date], async (error) => {
      if (error) {
        console.log(error);
        res.send(error);
        return;
      };
      // add Orders_Products
      for (i = 0; i < pids.length; i ++) {
        var pid = pids[i];
        var quantity = qtys[i];
        await addOrderInsertHelper(pid, quantity);
      }
      res.redirect('/add_order');
    });

    // add Orders_Products helper fuction
    function addOrderInsertHelper (pid, quantity) {
        // calculate the total_price.
      mysql.pool.query(getUnitPrice, pid, (error, results, fields) => {
        if (error) {
          console.log('getUnitPrice Error: ' + error);
          res.send(error);
          return;
        };
        var total_price = quantity * results[0].product_price;

        // Get the last added order_id for Orders
        mysql.pool.query(getLastOrderId, (error, results, fields) => {
          if (error) {
            console.log('getLastOrderId Error: ' + error);
            res.send(error);
            return;
          };
          var oid = results[0].order_id;

          // add Orders_Products
          mysql.pool.query(insertOrderProduct, [pid, oid, quantity, total_price], (error) => {
            if (error) {
              console.log('insertOrderProduct Error: ' + error);
              res.send(error);
              return;
            };
          });
        });
      });
    };
  }

  // READ ORDERS_PRODUCTS
  function getOrderDetails(req, res){
    var mysql = req.app.get('mysql');
    var orderId = req.params.id;

    var context = {'title': 'Order Details: ' + orderId, 'jsscripts': ['scripts', 'orders_products']};
    function renderOrderDetails(err, rows, fields){
      if (err) {
        console.log(err);
        res.send(err);
        return;
      };

      var inputList = [];
      for(i = 0; i < rows.length; i++){
        data = rows[i];
        temp = {};
        temp['list_order'] = i;
        temp['id'] = data['oid'];
        if (data['pid'] === null) {
          temp['prodId'] = 'Not Available';
          temp['prodName'] = 'Not Available';
        } else {
          temp['prodId'] = data['pid'];
          temp['prodName'] = data['product_name']
        };
        temp['qty'] = data['quantity'];
        temp['total_price'] = data['total_price'];
        inputList.push(temp);
      };
      var grandTotal = 0;
      for (j = 0; j < inputList.length; j++){
        grandTotal = grandTotal + inputList[j]['total_price'];
      };
      context['inputList'] = inputList;
      context['grandTotal'] = grandTotal.toFixed(2);
      context['orderId'] = orderId;
      context['layout'] = 'noNav.handlebars';
      res.render('order_details', context);
    }
    mysql.pool.query(getOrderDetailsQuery, orderId, renderOrderDetails);
  }

  router.get('/', getOrders)
  router.post('/', searchOrder)
  router.put('/', updateOrder)
  router.delete('/', deleteOrder)
  router.get('/add_order', addOrderView)
  router.post('/add_order', addOrderInsert)
  router.get('/order_details/:id', getOrderDetails)

  return router;
}();
