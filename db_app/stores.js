module.exports = function(){
  var express = require('express');
  var router = express.Router();

  var getQuery = 'SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores ORDER BY store_id DESC';
  var searchQuery = 'SELECT store_id, store_name, street_address, state, zip_code FROM abc_stores WHERE store_name LIKE ?';
  var insertQuery = 'INSERT INTO abc_stores (store_name, street_address, state, zip_code) VALUES (?,?,?,?)';
  var updateQuery = 'UPDATE abc_stores SET store_name = ?, street_address = ?, state = ?, zip_code = ? WHERE store_id = ?';
  var deleteQuery = 'DELETE FROM abc_stores WHERE store_id = ?';


  // read stores helper function
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

  //-------------------------------------------------//


  //----------- Search Store Function ---------------//

  function searchStore(req, res){
    var mysql = req.app.get('mysql');
    var storeName = '%' + req.body.storeName + '%';

    mysql.pool.query(searchQuery, storeName, (error, results, fields) => {
      if (error) {
        console.log("DB searchStore Error: " + error);
        res.send(error);
        return;
      };
      res.render('stores', getStoreInputList(results));
    });
  };

  //-------------------------------------------------//


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

  //----------------------------------------------//


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
