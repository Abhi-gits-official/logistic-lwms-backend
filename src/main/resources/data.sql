-- Database initialization script for LWMS
-- This script will create sample data if the database is empty

-- Insert sample categories if they don't exist
INSERT IGNORE INTO Category (categoryId, categoryName, description) VALUES 
(1, 'Clothing', 'Apparel and textile products'),
(2, 'Electronics', 'Electronic devices and components'),
(3, 'Footwear', 'Shoes and boots'),
(4, 'Others', 'Miscellaneous items');

-- Insert sample inventory items if they don't exist
INSERT IGNORE INTO Inventory (itemId, itemName, quantity, location, lastUpdated, category_categoryId) VALUES 
(1, 'Shirt', 10, 'A', NOW(), 1),
(2, 'Laptop', 5, 'B', NOW(), 2),
(3, 'Sneakers', 15, 'C', NOW(), 3),
(4, 'Notebook', 20, 'D', NOW(), 4);

-- Insert sample shipments if they don't exist
INSERT IGNORE INTO Shipment (shipmentId, origin, destination, status, expectedDeliveryDate, itemId) VALUES 
(1, 'HYD', 'DLI', 'Pending', DATE_ADD(NOW(), INTERVAL 7 DAY), 1),
(2, 'DLI', 'MUM', 'In Transit', DATE_ADD(NOW(), INTERVAL 5 DAY), 2);

-- Insert sample space allocations if they don't exist
INSERT IGNORE INTO Space (spaceId, zone, totalCapacity, usedCapacity, availableCapacity) VALUES 
(1, 'A', 1000, 100, 900),
(2, 'B', 1000, 200, 800),
(3, 'C', 1000, 150, 850),
(4, 'D', 1000, 50, 950); 