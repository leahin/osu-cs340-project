-- [stores]

-- 1. read

-- filters

-- 2. add

-- 3. update

-- 4. delete


-- [customers]

-- 1. read

-- filters

-- 2. add

-- 3. update

-- 4. delete


-- [products]
-- 1. read
SELECT * FROM `abc_products`;

-- filters
SELECT * FROM `abc_products` WHERE product_name = :productName;

-- 2. add
INSERT INTO `abc_products` (product_name, product_price, product_type)
VALUES (:productName, :productPrice, :productType);

-- 3. update
UPDATE `abc_products`
SET product_name = :productName, prodcut_price = :productPrice, product_type = :productTypes
WHERE product_id = :productId;

-- 4. delete
DELETE FROM `abc_products` WHERE product_id=:productId;


-- [orders]
-- 1. read
SELECT * FROM `abc_orders`;
-- filters
SELECT * FROM `abc_orders` WHERE oid=:orderId;
SELECT * FROM `abc_orders` WHERE cid=:customerId;
SELECT * FROM `abc_orders` WHERE sid=:storeId;

-- 2. add
INSERT INTO `abc_orders` (cid, sid, order_date)
VALUES (:custId, :storeId, :orderDate);

-- 3. update
UPDATE `abc_orders` SET cid=:custId, sid=:stpreId, order_date=:orderDate WHERE order_id=:orderId;

-- 4. delete
DELETE FROM `abc_orders` WHERE order_id=:orderId;


-- [orders_products]
-- 1. read
SELECT * FROM `abc_orders_products` WHERE oid=:olderId;

-- 2. add
INSERT INTO `abc_orders_products` (pid, oid, quantity)
VALUES (:productId, :olderId, :quantity);

-- 3. update
UPDATE `abc_orders_products` SET pid=:productId, oid=:orderId, quantity=:quantity WHERE oid=:olderId AND pid=:productId;

-- 4. delete
DELETE FROM `abc_orders_products` WHERE oid=:orderId AND pid=:productId;
