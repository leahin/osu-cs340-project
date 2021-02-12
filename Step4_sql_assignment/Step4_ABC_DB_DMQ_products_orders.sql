-- [products]
-- 1. read
SELECT * FROM abc_products;

-- Filter

-- 2. add
INSERT INTO abc_products(product_name, product_price, product_type) VALUES (?, ?, ?);

-- 3. update
UPDATE abc_products SET product_name=?, prodcut_price=?, product_type=? WHERE product_id=?;

-- 4. delete
DELETE FROM abc_products WHERE product_id=?;


-- [orders]
-- 1. read
SELECT * FROM abc_orders;

-- 2. add
INSERT INTO abc_orders(cid, sid, order_date) VALUES (?, ?, ?);

-- 3. update
UPDATE abc_orders SET cid=?, sid=?, order_date=? WHERE order_id=?;

-- 4. delete
DELETE FROM abc_orders WHERE order_id=?;


-- [orders_products]
-- 1. read
SELECT * FROM abc_orders_products WHERE oid=?;

-- 2. add
INSERT INTO abc_orders_products (pid, oid, quantity) VALUES (?, ?, ?);

-- 3. update
UPDATE abc_orders_products SET pid=?, oid=?, quantity=? WHERE oid=? AND pid=?;

-- 4. delete
DELETE FROM abc_orders_products WHERE oid=? AND pid=?;
