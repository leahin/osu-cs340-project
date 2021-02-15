
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `abc_stores`;
-- Create Stores Table
CREATE TABLE `abc_stores` (
  `store_id` INT(11) AUTO_INCREMENT NOT NULL,
  `store_name` VARCHAR(255) NOT NULL,
  `street_address` VARCHAR(255) NOT NULL,
  `state` VARCHAR(3) NOT NULL,
  `zip_code` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
-- Dumping Data for stores
INSERT INTO `abc_stores` VALUES
  (1, 'ABC Downtown Seattle', '500 Pine Street', 'WA', '98101'),
  (2, 'ABC New York', '225 W 57th St', 'NY', '10019'),
  (3, 'ABC The Grove Los Angeles', '189 The Grove Drive', 'CA', '90036'),
  (4, 'ABC Downtown Portland', '701 SW Broadway', 'OR', '97205'),
  (5, 'ABC Houston Galleria', '5192 Hidalgo Street', 'TX', '77056'),
  (6, 'ABC Galleria Dallas', '5220 Alpha Road', 'TX', '75240'),
  (7, 'ABC Houston Galleria', '5192 Hidalgo Street', 'TX', '77056'),
  (8, 'ABC Boston', '497 Boylston St', 'MA', '02116')
  ;

DROP TABLE IF EXISTS `abc_customers`;
-- Create Customers Table
CREATE TABLE `abc_customers` (
  `customer_id` INT(11) AUTO_INCREMENT NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `birthday` date NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
-- Dumping Data for Customers
INSERT into `abc_customers` VALUES
  (1, 'Terrence', 'Dominguez-Smith', '1985-12-23'),
  (2, 'Carla', 'Kitzia', '1991-06-04'),
  (3, 'Christopher', 'Day', '1990-08-11'),
  (4, 'Ciara', 'Woods', '1958-11-12'),
  (5, 'Shay', 'Stevens', '1981-03-16'),
  (6, 'John', 'Chapman', '1996-10-21'),
  (7, 'Reynold', 'Ericson', '2000-11-05'),
  (8, 'Zaynab', 'House', '2002-07-07')
  ;

DROP TABLE IF EXISTS `abc_products`;
-- Create Products Table
CREATE TABLE `abc_products` (
  `product_id` INT(11) AUTO_INCREMENT NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `product_price` DECIMAL(15, 2) NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;;
-- Dumping Data for products
INSERT INTO abc_products VALUES
  (1, 'Bubble', 29.99),
  (2, 'Puffs', 29.99),
  (3, 'Productify', 39.99),
  (4, 'Prodcutjet', 39.99),
  (5, 'Microzen', 69.99),
  (6, 'Microcog', 79.99),
  (7, 'Reboot Link', 80.25),
  (8, 'Repair Link', 85.25),
  (9, 'Jam', 45.50),
  (10, 'Data', 40.75)
  ;

DROP TABLE IF EXISTS `abc_orders`;
-- Create Orders Table
CREATE TABLE `abc_orders` (
  `order_id` INT(11) AUTO_INCREMENT NOT NULL,
  `cid` INT(11),
  `sid` INT(11),
  `order_date` date NOT NULL DEFAULT CURRENT_DATE(),
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`cid`) REFERENCES `abc_customers` (`customer_id`),
  FOREIGN KEY (`sid`) REFERENCES `abc_stores` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;;
-- Dumping Data for orders
INSERT INTO `abc_orders` VALUES
  (1, 8, 1, '2019-05-07'),
  (2, 7, 2, '2019-06-08'),
  (3, 6, 3, '2019-06-08'),
  (4, 5, 4, '2019-07-12'),
  (5, 4, 5, '2019-08-31'),
  (6, 3, 6, '2020-01-05'),
  (7, 2, 7, '2020-03-15'),
  (8, 1, 8, '2021-01-10'),
  (9, 2, 7, '2021-01-28'),
  (10, 1, 8, '2021-02-10')
  ;

DROP TABLE IF EXISTS `abc_orders_products`;
-- Create Orders_products Table
CREATE TABLE `abc_orders_products` (
  `pid` INT(11),
  `oid` INT(11),
  `quantity` TINYINT(1) NOT NULL,
  PRIMARY KEY (`pid`, `oid`),
  FOREIGN KEY (`pid`) REFERENCES `abc_products` (`product_id`),
  FOREIGN KEY (`oid`) REFERENCES `abc_orders` (`order_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1;;
-- Dumping Data for orders_products
INSERT INTO `abc_orders_products` VALUES
  (3, 1, 1),
  (4, 1, 2),
  (5, 1, 2),
  (1, 2, 3),
  (2, 2, 2),
  (6, 3, 4),
  (7, 4, 5),
  (8, 4, 1),
  (9, 4, 1),
  (1, 5, 2),
  (10, 6, 3),
  (8, 7, 4),
  (9, 7, 4),
  (10, 7, 5),
  (2, 8, 2),
  (3, 8, 2),
  (4, 8, 2),
  (2, 9, 4),
  (3, 9, 5),
  (1, 10, 10)
  ;
