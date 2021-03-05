-- Create Table with Store ID, Store Name, Product Name, Total Qty from the total orders where the filter equals a product.

-- Products by Store
SELECT abc_stores.store_id, abc_stores.store_name, abc_products.product_name, IFNULL(SUM(abc_orders_products.quantity), 0) as Total
FROM abc_orders_products
JOIN abc_orders ON abc_orders_products.oid = abc_orders.order_id
JOIN abc_stores ON abc_stores.store_id = abc_orders.sid
JOIN abc_products ON abc_products.product_id = abc_orders_products.pid
WHERE abc_products.product_id = 1
Group BY abc_stores.store_id ASC;


-- SELECT abc_stores.store_id, abc_stores.store_name, abc_products.product_name, abc_orders_products.quantity
-- FROM abc_orders_products
-- JOIN abc_orders ON abc_orders_products.oid = abc_orders.order_id
-- JOIN abc_stores ON abc_stores.store_id = abc_orders.sid
-- JOIN abc_products ON abc_products.product_id = abc_orders_products.pid
-- Group BY abc_stores.store_id ASC;

-- Product by Age Group will be revised to convert to customers age then replace customer info with the age group.
SELECT abc_customers.customer_id, abc_customers.first_name, abc_customers.last_name, abc_products.product_name, IFNULL(SUM(abc_orders_products.quantity), 0) as Total
FROM abc_orders_products
JOIN abc_orders ON abc_orders_products.oid = abc_orders.order_id
JOIN abc_customers ON abc_customers.customer_id = abc_orders.cid
JOIN abc_products ON abc_products.product_id = abc_orders_products.pid
WHERE abc_products.product_id = 1
Group BY abc_customers.customer_id ASC;