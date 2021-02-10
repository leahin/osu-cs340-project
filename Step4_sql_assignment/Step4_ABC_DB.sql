

-- Create Stores Table
CREATE TABLE abc_stores (
    store_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    state VARCHAR(3) NOT NULL,
    zip_code VARCHAR(5) NOT NULL);


DESCRIBE abc_stores

-- Create Products Table
CREATE TABLE abc_products (
    product_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price FLOAT NOT NULL,
    product_type VARCHAR(255) NOT NULL);


-- Create Customers Table
CREATE TABLE abc_customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birthday date NOT NULL);


-- Create Orders Table
CREATE TABLE abc_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    cid INT,
    sid INT,
    order_date date NOT NULL,
    FOREIGN KEY(cid) REFERENCES abc_customers(customer_id),
    FOREIGN KEY(sid) REFERENCES abc_stores(store_id)

    );


--Create Orders_products Table
CREATE TABLE abc_orders_products (
    pid INT,
    oid INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY(pid) REFERENCES abc_products(product_id),
    FOREIGN KEY(oid) REFERENCES abc_orders(order_id)
    
    );

