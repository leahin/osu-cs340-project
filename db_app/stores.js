module.exports = function(){
  var express = require('express');
  var router = express.Router();

  var getQuery = 'SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores';
  var searchQuery = 'SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores WHERE store_name = ?';
  var insertQuery = 'INSERT INTO abc_stores (store_name, street_address, state, zip_code) VALUES (?,?,?,?)';
  var updateQuery = 'UPDATE abc_stores SET store_name = ?, street_address = ?, state = ?, zip_code = ? WHERE store_id = ?';
  var deleteQuery = 'DELETE FROM abc_stores WHERE store_id = ?';


// READ Store
function getStoreInputList(results){
  var context = {'title': 'Stores', 'jsscripts': ['scripts', 'stores']};
  var inputList = [];

  for (i = 0; i < results.length; i++){
    var data = results[i];
    var temp = {};
    temp['store_id'] = data.store_id;
    temp['store_name'] = data.store_name;
    temp['street_address'] = data.street_address;
    temp['state'] = data.state;
    temp['zip_code'] = data.zip_code;

    inputList.push(temp);
  };

  context['inputList'] = inputList;
  JSON.stringify(context);
  return context;
};

//----------- Read Store Function ---------------//

function getStores(req, res){
  var mysql = req.app.get('mysql');

  mysql.pool.query(getQuery, (error, results, fields) => {
    if (error) {
      console.log("DB getStores Error: " + error);
      res.send(error);
      return;
    }
    res.render('stores', getStoreInputList(results));
  });
};

//----------------------------------------------//


//----------- Search Store Function ---------------//

function searchStore(req, res){
  var mysql = req.app.get('mysql');
  var storeName = req.body.storeName;

  mysql.pool.query(searchQuery, storeName, (error, results, fields) => {
    if (error) {
      console.log("DB searchStore Error: " + error);
      res.send(error);
      return;
    };
    res.render('stores', getStoreInputList(results));
  });
};


//----------- Add Store Function ---------------//

function insertStore(req, res){
  var mysql = req.app.get('mysql');
  var {storeName, streetAddress, state, zipCode} = req.body;

  mysql.pool.query (insertQuery, [storeName, streetAddress, state, zipCode], (error) => {
  if (error) {
      console.log("DB insertStore Error: " + error);
      res.send(error);
      return;
    };
    res.redirect('/stores');
  });
};

//----------------------------------------------//


//----------- Update Store Function ---------------//

function updateStore(req, res) {
  var mysql = req.app.get('mysql');
  var {store_id, store_name, street_address, state, zip_code} = req.body;
  mysql.pool.query(updateQuery, [store_name, street_address, state, zip_code, store_id], (error) => {
    if(error){
      console.log("DB updateStore Error: " + error);
      res.send(error);
      return;
    };
    res.redirect('/stores');
  });
};

//----------- Delete Store Function ---------------//

function deleteStore(req, res) {
  var mysql = req.app.get('mysql');
  var store_Id = req.body.id;

  mysql.pool.query(deleteQuery, store_Id, (error) => {
    if (error) {
      console.log("DB deleteStore Error: " + error);
      res.send(error);
      return;
    }
    res.redirect('/stores');
  });
};

//------------------------------------------------//



router.get('/', getStores)
router.post('/', searchStore)
router.post('/insert', insertStore)
router.delete('/', deleteStore)
router.put('/', updateStore)


return router;
}();




// //   function getSearchStore(req,res,mysql,context,complete){
// //     var sql = "SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores WHERE concat(store_name, state) = ?"
// //     var inserts = [req.params.name];
// //     console.log(inserts);
// //     mysql.pool.query(sql, inserts, function(error, results, fields){
// //         if(error){
// //             res.write(JSON.stringify(error));
// //             res.end();
// //         }
// //         console.log(results);

// //         context.stores = results;
// //         complete();
// //     })
// // }



//   // Get Store Data from DB

//     function getStores(res, mysql, context, complete) {
//     mysql.pool.query("SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores", function (error, results, fields) {
//       if (error) {
//         res.write(JSON.stringify(error));
//         res.end();
//       }
//       context.stores = results;
//       complete();
//     });
//   }



//   function getStore(res, mysql, context, id, complete){
//     var sql = "SELECT store_id as id, store_name, street_address, state, zip_code FROM abc_stores WHERE store_id = ?";
//     var inserts = [id];
//     mysql.pool.query(sql, inserts, function(error, results, fields){
//         if(error){
//             res.write(JSON.stringify(error));
//             res.end();
//         }
//         context.person = results[0];
//         complete();
//     });
// }




//   // Route Store Data from DB

//   router.get('/', function (req, res) {
//     var callbackCount = 0;
//     var context = {};
//     context.jsscripts = ["deleteStore.js"];
//     var mysql = req.app.get('mysql');
//     getStores(res, mysql, context, complete);
//     function complete() {
//       callbackCount++;
//       if (callbackCount >= 1) {
//         res.render('stores', context);
//       }
//     }
//   });

//   // Adds a store to db

//   router.post('/', function (req, res) {
//     console.log(req.body)
//     var mysql = req.app.get('mysql');
//     var sql = "INSERT INTO abc_stores (store_name, street_address, state, zip_code) VALUES (?,?,?,?)";
//     var inserts = [req.body.store_name, req.body.street_address, req.body.state, req.body.zip_code];
//     sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
//       if (error) {
//         console.log(JSON.stringify(error))
//         res.write(JSON.stringify(error));
//         res.end();
//       } else {
//         res.redirect('/stores');
//       }
//     });
//   });


// //   router.get('/search/:name', function(req, res){
// //     var callbackCount = 0;
// //     var context = {};
// //     context.jsscripts = ["scriptStores.js"];
// //     console.log(context);
// //     var mysql = req.app.get('mysql');
// //     getSearchStore(req,res,mysql, context, complete);
// //     function complete(){
// //         callbackCount++;
// //         if(callbackCount >= 1){
// //             res.render('stores', context);
// //         }
// //     }

// // })
// router.get('/:id', function(req, res){
//   callbackCount = 0;
//   var context = {};
//   context.jsscripts = ["updateStore.js"];
//   var mysql = req.app.get('mysql');
//   getStore(res, mysql, context, req.params.id, complete);
//   function complete(){
//       callbackCount++;
//       if(callbackCount >= 1){
//           res.render('update-store', context);
//       }

//   }
// });

//   router.put('/:id', function (req, res) {
//     var mysql = req.app.get('mysql');
//     console.log(req.body)
//     console.log(req.params.id)
//     var sql = "UPDATE abc_stores SET store_name=?, street_address=?, state=?, zip_code=? WHERE store_id=?";
//     var inserts = [req.body.store_name, req.body.street_address, req.body.state, req.body.zip_code, req.params.id];
//     sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
//       if (error) {
//         console.log(error)
//         res.write(JSON.stringify(error));
//         res.end();
//       } else {
//         res.status(200);
//         res.end();
//       }
//     });
//   });




//   router.delete('/:id', function (req, res) {
//     var mysql = req.app.get('mysql');
//     var sql = "DELETE FROM abc_stores WHERE store_id = ?";
//     var inserts = [req.params.id];
//     sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
//       if (error) {
//         console.log(error)
//         res.write(JSON.stringify(error));
//         res.status(400);
//         res.end();
//       } else {
//         res.status(202).end();
//       }
//     })
//   })


//   return router;
// }();