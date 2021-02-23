module.exports = function(){
  var express = require('express');
  var router = express.Router();

  var getQuery = 'SELECT * FROM abc_products ORDER BY product_id DESC';
  var searchQuery = 'SELECT * FROM abc_products WHERE product_name = ? ORDER BY product_id DESC';
  var insertQuery = 'INSERT INTO abc_products (product_name, product_price) VALUES (?, ?)';
  var updateQuery = 'UPDATE abc_products SET product_name = ?, product_price = ? WHERE product_id = ?';
  var deleteQuery = 'DELETE FROM abc_products WHERE product_id = ?';


  function getProductInputList(results){
    var context = {'title': 'Products', 'jsscripts': ['scripts', 'products']};
    var inputList = [];

    for (i = 0; i < results.length; i++){
      var data = results[i];
      var temp = {};
      temp['product_id'] = data.product_id;
      temp['product_name'] = data.product_name;
      temp['product_price'] = data.product_price;
      inputList.push(temp)
    };

    context['inputList'] = inputList;
    JSON.stringify(context)

    return context;
  };


  function getProducts(req, res){
    var mysql = req.app.get('mysql');

    mysql.pool.query(getQuery, (error, results, fields) => {
      res.render('products', getProductInputList(results))
    })
  };


  function searchProduct(req, res){
    var mysql = req.app.get('mysql');
    var productName = req.body.productName;

    mysql.pool.query(searchQuery, productName, (error, results, fields) => {
      res.render('products', getProductInputList(results))
    })
  };


  function insertProduct(req, res){
    var mysql = req.app.get('mysql');
    var {productName, productPrice} = req.body;

    // TODO: user input validation
    if (productName === ""){

    }
    if (productPrice <= 0) {

    }

    mysql.pool.query (insertQuery, [productName, productPrice])
    res.redirect('/products')
  };


  function updateProduct(req, res) {
    var mysql = req.app.get('mysql');
    var {product_id, product_name, product_price} = req.body;

    // TODO: data validation
    mysql.pool.query(selectQuery, [product_id], (error, results, fields) => {
      var original = results[0];
      mysql.pool.query(updateQuery, [product_name || original.product_name,
        product_price || original.product_price], (error, results, fields) => {
          mysql.pool.query(getQuery, (error, results, fields) => {
            res.render('products', getProductInputList(results))
          })
        })
    })
  };


  function deleteProduct(req, res) {
    var mysql = req.app.get('mysql');
    var productId = req.body.id;

    mysql.pool.query(deleteQuery, productId, (error, results, fields) => {
      mysql.pool.query(getQuery, (error, results, fields) => {
        res.render('products', getProductInputList(results))
      })
    })
  };


  router.get('/', getProducts)
  router.post('/insert', insertProduct)
  router.post('/', searchProduct)
  router.put('/', updateProduct)
  router.delete('/', deleteProduct)
  return router;
}();
