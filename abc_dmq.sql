-- [stores]

-- 1. read
SELECT * FROM `abc_stores`;

-- filters
SELECT * FROM `abc_stores` WHERE store_name LIKE %:storeNameFilterKeyword%;

-- 2. add
INSERT INTO `abc_stores` (store_name, street_address, state, zip_code)
VALUES (:storeName, :storeStreetAddress, :storeState, :storeZipCode);

-- 3. update
UPDATE `abc_stores`
SET store_name = :storeName, street_address = :storeStreetAddress, state = :storeState, zip_code = :storeZipCode
WHERE store_id = :storeId;

-- 4. delete
DELETE FROM `abc_stores` WHERE store_id = :storeId;


-- [customers]

-- 1. read
SELECT * FROM `abc_customers`;

-- filters
SELECT customer_id, first_name, last_name, birthdate FROM abc_customers WHERE last_name LIKE %:customerLNameFilterKeyword%;

-- 2. add
INSERT INTO `abc_customers` (first_name, last_name, birthdate)
VALUES (:customerFName, :customerLName, :customerBday);

-- 3. update
UPDATE `abc_customers`
SET first_name = :customerFName, last_name = :customerLName, birthdate = :customerBday
WHERE customer_id = custId;

-- 4. delete
DELETE FROM `abc_customer` WHERE customer_id = :custId;


-- [products]
-- 1. read
SELECT * FROM `abc_products`;

-- filters
SELECT * FROM `abc_products` WHERE product_name LIKE %:productNameFilterKeyword%;

-- 2. add
INSERT INTO `abc_products` (product_name, product_price)
VALUES (:productName, :productPrice);

-- 3. update
UPDATE `abc_products`
SET product_name = :productName, product_price = :productPrice
WHERE product_id = :productId;

-- 4. delete
DELETE FROM `abc_products` WHERE product_id=:productId;


-- [orders]
-- 1. read
SELECT * FROM `abc_orders` ORDER BY order_id DESC;
-- filters (order Id, customer id, store id or mixed.)
SELECT * FROM `abc_orders` WHERE order_id=:orderId;
SELECT * FROM `abc_orders` WHERE cid=:custId;
SELECT * FROM `abc_orders` WHERE sid=:storeId;
SELECT * FROM `abc_orders` WHERE cid=:custId AND sid=:storeId;
-- WHERE order_id AND ... possible but because there are only 1 order_id, this query is not meaningful.

-- 2. add
INSERT INTO `abc_orders` (cid, sid, order_date)
VALUES (:custId, :storeId, :orderDate);

-- 3. update
UPDATE `abc_orders` SET cid=:custId, sid=:storeId, order_date=:orderDate WHERE order_id=:orderId;

-- 4. delete
DELETE FROM `abc_orders` WHERE order_id=:orderId;


-- [orders_products]
-- 1. read
SELECT * FROM `abc_orders_products` WHERE oid=:olderId;

-- 1-1. order_details read query
SELECT op.oid, op.pid, p.product_name, op.quantity, op.total_price FROM `abc_orders_products` AS op
INNER JOIN `abc_products` as p ON op.pid = p.product_id
WHERE op.oid = ? ORDER BY op.pid;

-- 2. add
INSERT INTO `abc_orders_products` (pid, oid, quantity, total_price)
VALUES (:productId, :olderId, :quantity, :totalPrice_unit_times_quantity);

-- UPDATED: update/delete is not possible withoout a primary key. entires with the same values will be updated/deleted simultaneously.

-- 3. update
--UPDATE `abc_orders_products` SET pid=:productId, oid=:orderId, quantity=:quantity, total_price=:totalPrice_unit_times_quantity
--WHERE oid=:olderId AND pid=:productId;

-- 4. delete
--DELETE FROM `abc_orders_products` WHERE oid=:orderId AND pid=:productId;


-- Sales (READ)
SELECT s.store_id, s.store_name, SUM(op.total_price) AS total_sales FROM `abc_orders_products` AS op
INNER JOIN `abc_orders` AS o ON op.oid = o.order_id
INNER JOIN `abc_stores` AS s ON o.sid = s.store_id
GROUP BY s.store_id
ORDER BY total_sales DESC;

-- Sales filter (start date and end date inclusive)
SELECT s.store_id, s.store_name, SUM(op.total_price) AS total_sales FROM `abc_orders_products` AS op
INNER JOIN `abc_orders` AS o ON op.oid = o.order_id
INNER JOIN `abc_stores` AS s ON o.sid = s.store_id
WHERE o.order_date BETWEEN :startDate AND :endDate
GROUP BY s.store_id
ORDER BY total_sales DESC;

-- Stores & Products Filter
SELECT s.store_id, s.store_name, p.product_id, p.product_name, IFNULL(SUM(op.quantity), 0) as total
FROM abc_stores AS s
INNER JOIN abc_orders AS o ON s.store_id = o.sid
INNER JOIN abc_orders_products AS op ON o.order_id = op.oid
INNER JOIN abc_products AS p ON op.pid = p.product_id
WHERE product_id = :productId
GROUP BY s.store_id ORDER BY total DESC;

-- Customers and Products Filter
/* TIMESTAMPDIFF(YEAR, c.birthdate, CURDATE()) AS age
  Date: 3/9/21
  Copied & modified from
  Source URL: https://stackoverflow.com/questions/5773405/calculate-age-in-mysql-innodb
*/

SELECT p.product_id, p.product_name, IFNULL(SUM(op.quantity), 0) AS total,
IFNULL(SUM(op.total_price), 0) AS total_price FROM
  (SELECT c.customer_id, c.first_name, TIMESTAMPDIFF (YEAR, c.birthdate, CURDATE()) AS age \
    FROM abc_customers AS c HAVING age >= :ageLower AND age <= :ageUpper) AS tempc
INNER JOIN abc_orders AS o ON tempc.customer_id = o.cid
INNER JOIN abc_orders_products AS op ON o.order_id = op.oid
INNER JOIN abc_products AS p ON op.pid = p.product_id
GROUP BY p.product_id ORDER BY total DESC;
