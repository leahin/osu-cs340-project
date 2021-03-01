module.exports = function(){
  var express = require('express');
  var router = express.Router();

  var getQuery = 'SELECT * FROM abc_products';
  var searchQuery = 'SELECT * FROM abc_products WHERE product_name = ?';
  var insertQuery = 'INSERT INTO abc_products (product_name, product_price) VALUES (?, ?)';
  var updateQuery = 'UPDATE abc_products SET product_name = ?, product_price = ? WHERE product_id = ?';
  var deleteQuery = 'DELETE FROM abc_products WHERE product_id = ?';

  // READ Products helper function
  function getProductInputList(results){
    var context = {'title': 'Products', 'jsscripts': ['scripts', 'products']};
    var inputList = [];

    for (i = 0; i < results.length; i++){
      var data = results[i];
      var temp = {};
      temp['product_id'] = data.product_id;
      temp['product_name'] = data.product_name;
      temp['product_price'] = data.product_price.toFixed(2);

      inputList.push(temp);
    };

    context['inputList'] = inputList;
    JSON.stringify(context);
    return context;
  };

  // READ Products
  function getProducts(req, res){
    var mysql = req.app.get('mysql');

    mysql.pool.query(getQuery, (error, results, fields) => {
      if (error) {
        console.log("DB getProducts Error: " + error);
        res.send(error);
        return;
      }
      res.render('products', getProductInputList(results));
    });
  };

  // Filter Products
  function searchProduct(req, res){
    var mysql = req.app.get('mysql');
    var productName = req.body.productName;

    if (productName.trim() === ""){
      res.send("ERROR: No User Input.");
      return;
    }

    mysql.pool.query(searchQuery, productName, (error, results, fields) => {
      if (error) {
        console.log("DB searchProduct Error: " + error);
        res.send(error);
        return;
      };
      res.render('products', getProductInputList(results));
    });
  };

  // CREATE Products
  function insertProduct(req, res){
    var mysql = req.app.get('mysql');
    var {productName, productPrice} = req.body;

    // User input validation.
    if (productName.trim() === ""){
      return;
    };
    if (productPrice <= 0 || isNaN(productPrice)) {
      return;
    };

    mysql.pool.query (insertQuery, [productName, productPrice], (error) => {
    if (error) {
        console.log("DB insertProduct Error: " + error);
        res.send(error);
        return;
      };
      res.redirect('/products');
    });
  };

  // Update Products
  function updateProduct(req, res) {
    var mysql = req.app.get('mysql');
    var {product_id, product_name, product_price} = req.body;

    if (product_name.trim() === ""){
      res.send("Please Enter a Valid Product Name.");
      return;
    };
    if (product_price <= 0 || isNaN(product_price)) {
      res.send("Please Enter a Valid Product Price.");
      return;
    };

    mysql.pool.query(updateQuery, [product_name, product_price, product_id], (error) => {
      if(error){
        console.log("DB updateProduct Error: " + error);
        res.send(error);
        return;
      };
      res.redirect('/products');
    });
  };

  // DELETE Products
  function deleteProduct(req, res) {
    var mysql = req.app.get('mysql');
    var productId = req.body.id;

    mysql.pool.query(deleteQuery, productId, (error) => {
      if (error) {
        console.log("DB deleteProduct Error: " + error);
        res.send(error);
        return;
      }
      res.redirect('/products');
    });
  };

  router.get('/', getProducts)
  router.post('/insert', insertProduct)
  router.post('/', searchProduct)
  router.put('/', updateProduct)
  router.delete('/', deleteProduct)
  return router;
}();
