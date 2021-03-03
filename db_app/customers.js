module.exports = function(){

  var express = require('express');
  var router = express.Router();



  // Move Queries into functions

  
  var getQuery = 'SELECT customer_id, first_name, last_name, birthdate FROM abc_customers';
  var searchQuery = 'SELECT customer_id, first_name, last_name, birthdate FROM abc_customers WHERE first_name = ?';
  var insertQuery = 'INSERT INTO abc_customers (first_name, last_name, birthdate) VALUES (?,?,?)';
  var updateQuery = 'UPDATE abc_customers SET first_name = ?, last_name = ?, birthdate = ? WHERE customer_id = ?';
  var deleteQuery = 'DELETE FROM abc_customers WHERE customer_id = ?';


// READ Store
function getCustomerInputList(results){
  var context = {'title': 'Customers', 'jsscripts': ['scripts', 'customers']};
  var inputList = [];
  for (i = 0; i < results.length; i++){
    var data = results[i];
    var temp = {};
    temp['customer_id'] = data.customer_id;
    temp['first_name'] = data.first_name;
    temp['last_name'] = data.last_name;

    var raw = new Date(data.birthdate);
    year = String(raw.getFullYear());
    var month = String(raw.getMonth() + 1);
    if (month.length < 2) {
      month = '0' + month;
    }
    var date = String(raw.getDate());
    if (date.length < 2) {
      date = '0' + date;
    }
    temp['birthdate'] = year + '-' + month + '-' + date;

    inputList.push(temp);
  };

  context['inputList'] = inputList;
  JSON.stringify(context);
  return context;
};

//----------- Read Store Function ---------------//

function getCustomers(req, res){
  var mysql = req.app.get('mysql');

  mysql.pool.query(getQuery, (error, results, fields) => {
    if (error) {
      console.log("DB getCustomers Error: " + error);
      res.send(error);
      return;
    }
    res.render('customers', getCustomerInputList(results));
  });
};

//----------------------------------------------//


//----------- Search Store Function ---------------//

function searchCustomer(req, res){
  var mysql = req.app.get('mysql');
  var custFname = req.body.custFname;
  var custLname = req.body.custLname;
  var custBdayFrom = req.body.custBdayFrom;
  var custBdayTo = req.body.custBdayTo;

  mysql.pool.query(searchQuery, customerName, (error, results, fields) => {
    if (error) {
      console.log("DB searchCustomer Error: " + error);
      res.send(error);
      return;
    };
    res.render('customers', getCustomerInputList(results));
  });
};


//----------- Add Store Function ---------------//

function insertCustomer(req, res){
  var mysql = req.app.get('mysql');
  var {custFname, custLname, custBirthdate} = req.body;

  mysql.pool.query (insertQuery, [custFname, custLname, custBirthdate], (error) => {
  if (error) {
      console.log("DB insertCustomer Error: " + error);
      res.send(error);
      return;
    };
    res.redirect('/customers');
  });
};

//----------------------------------------------//


//----------- Update Store Function ---------------//

function updateCustomer(req, res) {
  var mysql = req.app.get('mysql');
  var {customer_id, first_name, last_name, birthdate} = req.body;
  mysql.pool.query(updateQuery, [first_name, last_name, birthdate, customer_id], (error) => {
    if(error){
      console.log("DB updateCustomer Error: " + error);
      res.send(error);
      return;
    };
    res.redirect('/customers');
  });
};

//----------- Delete Store Function ---------------//

function deleteCustomer(req, res) {
  var mysql = req.app.get('mysql');
  var customer_Id = req.body.id;

  mysql.pool.query(deleteQuery, customer_Id, (error) => {
    if (error) {
      console.log("DB deleteCustomer Error: " + error);
      res.send(error);
      return;
    }
    res.redirect('/customers');
  });
};

//------------------------------------------------//



router.get('/', getCustomers)
router.post('/', searchCustomer)
router.post('/insert', insertCustomer)
router.delete('/', deleteCustomer)
router.put('/', updateCustomer)


return router;
}();

//   // Get Customer Data from Server
//   function getCustomers(res, mysql, context, complete) {
//     mysql.pool.query("SELECT customer_id, first_name, last_name, birthdate FROM abc_customers", function (error, results, fields) {
//       if (error) {
//         res.write(JSON.stringify(error));
//         res.end();
//       }
//       context.customers = results;
//       complete();
//     });
//   }

// // Route Customer Data from Server
//   router.get('/', function (req, res) {
//     var callbackCount = 0;
//     var context = {};
//     var mysql = req.app.get('mysql');

//     getCustomers(res, mysql, context, complete);

//     function complete() {
//       callbackCount++;
//       if (callbackCount >= 1) {
//         res.render('customers', context);
//       }

//     }
//   });

//   // Adds a store to db

//   router.post('/', function (req, res) {
//     console.log(req.body)
//     var mysql = req.app.get('mysql');
//     var sql = "INSERT INTO abc_customers (first_name, last_name, birthdate) VALUES (?,?,?)";
//     var inserts = [req.body.first_name, req.body.last_name, req.body.birthdate];
//     sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
//       if (error) {
//         console.log(JSON.stringify(error))
//         res.write(JSON.stringify(error));
//         res.end();
//       } else {
//         res.redirect('/customers');
//       }
//     });
//   });


//   return router;
// }();


// Comment Source Code Here:
//Leah In Products.js (will correct this soon)