-- Create Stores Table
CREATE TABLE abc_stores (
    store_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    state VARCHAR(3) NOT NULL,
    zip_code VARCHAR(5) NOT NULL
    );

-- Create Products Table
CREATE TABLE abc_products (
    product_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price FLOAT NOT NULL,
    product_type VARCHAR(255) NOT NULL
    );


-- Create Customers Table
CREATE TABLE abc_customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birthday date NOT NULL
    );


-- Create Orders Table
CREATE TABLE abc_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    cid INT,
    sid INT,
    order_date date NOT NULL,
    FOREIGN KEY(cid) REFERENCES abc_customers(customer_id),
    FOREIGN KEY(sid) REFERENCES abc_stores(store_id)
    );


-- Create Orders_products Table
CREATE TABLE abc_orders_products (
    pid INT,
    oid INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(pid, oid),
    FOREIGN KEY(pid) REFERENCES abc_products(product_id),
    FOREIGN KEY(oid) REFERENCES abc_orders(order_id)
    );

-- Dumping Data for stores
INSERT into abc_stores (store_name, street_address, state, zip_code) VALUES
('ABC Downtown Seattle', '500 Pine Street', 'WA', '98101'),
('ABC New York', '225 W 57th St', 'NY', '10019'),
('ABC The Grove Los Angeles', '189 The Grove Drive', 'CA', '90036'),
('ABC Downtown Portland', '701 SW Broadway', 'OR', '97205'),
('ABC Houston Galleria', '5192 Hidalgo Street', 'TX', '77056'),
('ABC Galleria Dallas', '5220 Alpha Road', 'TX', '75240'),
('ABC Houston Galleria', '5192 Hidalgo Street', 'TX', '77056'),
('ABC Boston', '497 Boylston St', 'MA', '02116')
;

-- Dumping Data for Customers
INSERT into abc_customers (first_name, last_name, birthday) VALUES
('Terrence', 'Dominguez-Smith', '1985-12-23'),
('Carla', 'Kitzia', '1991-06-04'),
('Christopher', 'Day', '1990-08-11'),
('Ciara', 'Woods', '1958-11-12'),
('Shay', 'Stevens', '1981-03-16'),
('John', 'Chapman', '1996-10-21'),
('Reynold', 'Ericson', '2000-11-05'),
('Zaynab'. 'House', '2002-07-07')
;

-- Dumping Data for products
INSERT INTO abc_products (product_name, product_price, product_type) VALUES
('Chocolate Bubble', '29.99', 'Type A'),
('Chocolate Puffs', '29.99', 'Type A'),
('Productify', '39.99', 'Type B'),
('Prodcutjet', '39.99', 'Type B'),
('Microzen', '69.99', 'Type C'),
('Microcog', '79.99', 'Type C'),
('Reboot Link', '80.25', 'Type D'),
('Repair Link', '85.25', 'Type D'),
('Jam Sprinkle', '45.50', 'Type E'),
('Mecha Data', '40.75', 'Type F')
;

-- Dumping Data for orders
INSERT INTO abc_orders (cid, sid, order_date) VALUES
('8', '1', '2019-05-07'),
('7', '2', '2019-06-08'),
('6', '3', '2019-06-08'),
('5', '4', '2019-07-12'),
('4', '5', '2019-08-31'),
('3', '6', '2020-01-05'),
('2', '7', '2020-03-15'),
('1', '8', '2021-01-10'),
('2', '7', '2021-01-28'),
('1', '8', '2021-02-10')
;

-- Dumping Data for orders_products
INSERT INTO abc_orders_products (pid, oid, quantity) VALUES
('3', '1', '1'),
('4', '1', '2'),
('5', '1', '2'),
('1', '2', '3'),
('2', '2', '2'),
('6', '3', '4'),
('7', '4', '5'),
('8', '4', '1'),
('9', '4', '1'),
('1', '5', '2'),
('10', '6', '3'),
('8', '7', '4'),
('9', '7', '4'),
('10', '7', '5'),
('2', '8', '2'),
('3', '8', '2'),
('4', '8', '2'),
('2', '9', '4'),
('3', '9', '5'),
('1', '10', '10')
;
