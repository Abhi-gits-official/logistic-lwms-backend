# LWMS Database Schema Documentation

## Overview
This document provides comprehensive database design information for the Logistics Warehouse Management System (LWMS), including entity relationships, table structures, constraints, and sample data.

## Table of Contents
1. [Database Overview](#database-overview)
2. [Entity Relationship Diagram](#entity-relationship-diagram)
3. [Table Definitions](#table-definitions)
4. [Relationships and Constraints](#relationships-and-constraints)
5. [Indexes and Performance](#indexes-and-performance)
6. [Sample Data](#sample-data)
7. [Database Scripts](#database-scripts)
8. [Migration Guide](#migration-guide)

## Database Overview

**Database Name**: `lwms`  
**Engine**: MySQL 8.0+  
**Character Set**: UTF-8  
**Collation**: utf8mb4_unicode_ci  
**Auto-increment Strategy**: Identity-based

### Key Features
- **ACID Compliance**: Full transaction support
- **Referential Integrity**: Foreign key constraints
- **Auto-incrementing IDs**: Surrogate primary keys
- **Audit Fields**: Timestamp tracking for modifications
- **JSON Support**: Native JSON data type support

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│    Inventory    │         │    Shipment     │
├─────────────────┤         ├─────────────────┤
│ PK: itemId      │◄────────┤ FK: itemId      │
│ itemName        │         │ PK: shipmentId  │
│ category        │         │ origin          │
│ quantity        │         │ destination     │
│ location        │         │ status          │
│ lastUpdated     │         │ expectedDelivery│
└─────────────────┘         └─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│      Space      │
├─────────────────┤
│ PK: spaceId     │
│ totalCapacity   │
│ usedCapacity    │
│ availableCapacity│
│ zone            │
└─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│ Maintenance     │         │     Report      │
├─────────────────┤         ├─────────────────┤
│ PK: scheduleId  │         │ PK: reportId    │
│ equipmentId     │         │ reportType      │
│ taskDescription │         │ generatedOn     │
│ scheduledDate   │         │ details         │
│ completionStatus│         └─────────────────┘
└─────────────────┘
```

## Table Definitions

### 1. Inventory Table

**Purpose**: Stores information about warehouse inventory items

**Table Name**: `Inventory`

```sql
CREATE TABLE Inventory (
    itemId INT PRIMARY KEY AUTO_INCREMENT,
    itemName VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    quantity INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_quantity_positive CHECK (quantity >= 0),
    CONSTRAINT uk_item_name UNIQUE (itemName),
    
    -- Indexes
    INDEX idx_category (category),
    INDEX idx_location (location),
    INDEX idx_last_updated (lastUpdated)
);
```

**Field Descriptions**:
- `itemId`: Primary key, auto-incrementing integer
- `itemName`: Unique name of the inventory item
- `category`: Item category for classification
- `quantity`: Available quantity (non-negative)
- `location`: Storage location in warehouse
- `lastUpdated`: Timestamp of last modification

**Data Types**:
- `itemId`: INT (4 bytes, range: 1 to 2,147,483,647)
- `itemName`: VARCHAR(255) (variable length string)
- `category`: VARCHAR(255) (variable length string)
- `quantity`: INT (4 bytes, range: 0 to 2,147,483,647)
- `location`: VARCHAR(255) (variable length string)
- `lastUpdated`: TIMESTAMP (8 bytes, format: YYYY-MM-DD HH:MM:SS)

### 2. Shipment Table

**Purpose**: Tracks incoming and outgoing shipments

**Table Name**: `Shipment`

```sql
CREATE TABLE Shipment (
    shipmentId INT PRIMARY KEY AUTO_INCREMENT,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    expectedDeliveryDate TIMESTAMP NULL,
    itemId INT NOT NULL,
    
    -- Constraints
    CONSTRAINT fk_shipment_inventory FOREIGN KEY (itemId) 
        REFERENCES Inventory(itemId) ON DELETE CASCADE,
    CONSTRAINT chk_status_valid CHECK (status IN ('Received', 'Dispatched', 'In Transit', 'Delivered')),
    
    -- Indexes
    INDEX idx_item_id (itemId),
    INDEX idx_status (status),
    INDEX idx_expected_delivery (expectedDeliveryDate),
    INDEX idx_origin (origin),
    INDEX idx_destination (destination)
);
```

**Field Descriptions**:
- `shipmentId`: Primary key, auto-incrementing integer
- `origin`: Shipment origin location
- `destination`: Shipment destination location
- `status`: Current shipment status
- `expectedDeliveryDate`: Expected delivery date and time
- `itemId`: Foreign key to Inventory table

**Data Types**:
- `shipmentId`: INT (4 bytes)
- `origin`: VARCHAR(255)
- `destination`: VARCHAR(255)
- `status`: VARCHAR(50)
- `expectedDeliveryDate`: TIMESTAMP
- `itemId`: INT (4 bytes)

**Status Values**:
- `Received`: Item received at warehouse
- `Dispatched`: Item dispatched from warehouse
- `In Transit`: Item in transit
- `Delivered`: Item delivered to destination

### 3. Space Table

**Purpose**: Manages warehouse space allocation and capacity

**Table Name**: `Space`

```sql
CREATE TABLE Space (
    spaceId INT PRIMARY KEY AUTO_INCREMENT,
    totalCapacity INT NOT NULL,
    usedCapacity INT NOT NULL DEFAULT 0,
    availableCapacity INT NOT NULL,
    zone VARCHAR(255) NOT NULL,
    
    -- Constraints
    CONSTRAINT chk_capacity_positive CHECK (totalCapacity > 0),
    CONSTRAINT chk_used_capacity_non_negative CHECK (usedCapacity >= 0),
    CONSTRAINT chk_available_capacity_non_negative CHECK (availableCapacity >= 0),
    CONSTRAINT chk_capacity_consistency CHECK (availableCapacity = totalCapacity - usedCapacity),
    
    -- Indexes
    INDEX idx_zone (zone),
    INDEX idx_available_capacity (availableCapacity)
);
```

**Field Descriptions**:
- `spaceId`: Primary key, auto-incrementing integer
- `totalCapacity`: Total warehouse capacity
- `usedCapacity`: Currently used capacity
- `availableCapacity`: Available capacity
- `zone`: Warehouse zone identifier

**Data Types**:
- `spaceId`: INT (4 bytes)
- `totalCapacity`: INT (4 bytes)
- `usedCapacity`: INT (4 bytes)
- `availableCapacity`: INT (4 bytes)
- `zone`: VARCHAR(255)

### 4. MaintenanceSchedule Table

**Purpose**: Schedules and tracks equipment maintenance

**Table Name**: `Maintenance`

```sql
CREATE TABLE Maintenance (
    scheduleId INT PRIMARY KEY AUTO_INCREMENT,
    equipmentId INT NOT NULL,
    taskDescription TEXT NOT NULL,
    scheduledDate TIMESTAMP NOT NULL,
    completionStatus VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    
    -- Constraints
    CONSTRAINT chk_equipment_id_positive CHECK (equipmentId > 0),
    CONSTRAINT chk_completion_status_valid CHECK (
        completionStatus IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue')
    ),
    
    -- Indexes
    INDEX idx_equipment_id (equipmentId),
    INDEX idx_scheduled_date (scheduledDate),
    INDEX idx_completion_status (completionStatus)
);
```

**Field Descriptions**:
- `scheduleId`: Primary key, auto-incrementing integer
- `equipmentId`: Equipment identifier
- `taskDescription`: Detailed description of maintenance task
- `scheduledDate`: Scheduled maintenance date and time
- `completionStatus`: Current completion status

**Data Types**:
- `scheduleId`: INT (4 bytes)
- `equipmentId`: INT (4 bytes)
- `taskDescription`: TEXT (variable length, up to 65,535 bytes)
- `scheduledDate`: TIMESTAMP (8 bytes)
- `completionStatus`: VARCHAR(50)

**Status Values**:
- `Scheduled`: Maintenance scheduled
- `In Progress`: Maintenance in progress
- `Completed`: Maintenance completed
- `Cancelled`: Maintenance cancelled
- `Overdue`: Maintenance overdue

### 5. Report Table

**Purpose**: Stores generated reports and analytics

**Table Name**: `Report`

```sql
CREATE TABLE Report (
    reportId INT PRIMARY KEY AUTO_INCREMENT,
    reportType VARCHAR(255) NOT NULL,
    generatedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details LONGTEXT,
    
    -- Constraints
    CONSTRAINT chk_report_type_not_empty CHECK (reportType != ''),
    
    -- Indexes
    INDEX idx_report_type (reportType),
    INDEX idx_generated_on (generatedOn)
);
```

**Field Descriptions**:
- `reportId`: Primary key, auto-incrementing integer
- `reportType`: Type of report generated
- `generatedOn`: Report generation timestamp
- `details`: Report content and data

**Data Types**:
- `reportId`: INT (4 bytes)
- `reportType`: VARCHAR(255)
- `generatedOn`: TIMESTAMP (8 bytes)
- `details`: LONGTEXT (variable length, up to 4,294,967,295 bytes)

## Relationships and Constraints

### Foreign Key Relationships

#### 1. Shipment → Inventory
```sql
CONSTRAINT fk_shipment_inventory 
    FOREIGN KEY (itemId) REFERENCES Inventory(itemId) 
    ON DELETE CASCADE
```
- **Relationship**: Many-to-One (Many shipments can reference one inventory item)
- **Delete Behavior**: CASCADE (If inventory item is deleted, all related shipments are deleted)
- **Business Logic**: Ensures data integrity - shipments cannot exist without inventory items

### Check Constraints

#### 1. Quantity Validation
```sql
CONSTRAINT chk_quantity_positive CHECK (quantity >= 0)
```
- **Purpose**: Prevents negative inventory quantities
- **Business Rule**: Warehouse cannot have negative stock

#### 2. Capacity Validation
```sql
CONSTRAINT chk_capacity_consistency CHECK (availableCapacity = totalCapacity - usedCapacity)
```
- **Purpose**: Ensures capacity calculations are consistent
- **Business Rule**: Available capacity must always equal total minus used

#### 3. Status Validation
```sql
CONSTRAINT chk_status_valid CHECK (status IN ('Received', 'Dispatched', 'In Transit', 'Delivered'))
```
- **Purpose**: Restricts shipment status to valid values
- **Business Rule**: Only predefined status values are allowed

### Unique Constraints

#### 1. Item Name Uniqueness
```sql
CONSTRAINT uk_item_name UNIQUE (itemName)
```
- **Purpose**: Prevents duplicate item names
- **Business Rule**: Each inventory item must have a unique name

## Indexes and Performance

### Primary Indexes
- **Clustered Indexes**: All primary keys are automatically clustered
- **Performance Impact**: Fast lookups by primary key

### Secondary Indexes

#### 1. Category Index
```sql
INDEX idx_category (category)
```
- **Purpose**: Optimize queries filtering by category
- **Use Case**: "Show all electronics items"

#### 2. Location Index
```sql
INDEX idx_location (location)
```
- **Purpose**: Optimize queries filtering by location
- **Use Case**: "Show all items in Zone A"

#### 3. Status Index
```sql
INDEX idx_status (status)
```
- **Purpose**: Optimize shipment status queries
- **Use Case**: "Show all received shipments"

#### 4. Date Indexes
```sql
INDEX idx_last_updated (lastUpdated)
INDEX idx_scheduled_date (scheduledDate)
INDEX idx_generated_on (generatedOn)
```
- **Purpose**: Optimize date-based queries and sorting
- **Use Case**: "Show recently updated items"

### Composite Indexes (Future Enhancement)
```sql
-- For complex queries
INDEX idx_item_category_location (itemName, category, location)
INDEX idx_shipment_item_status (itemId, status)
```

## Sample Data

### Inventory Sample Data
```sql
INSERT INTO Inventory (itemName, category, quantity, location) VALUES
('Laptop Dell XPS 13', 'Electronics', 25, 'Zone A - Shelf 1'),
('Wireless Mouse Logitech', 'Electronics', 100, 'Zone A - Shelf 2'),
('Office Chair Ergonomic', 'Furniture', 15, 'Zone B - Shelf 1'),
('Printer HP LaserJet', 'Office Equipment', 8, 'Zone B - Shelf 2'),
('Paper A4 80gsm', 'Office Supplies', 500, 'Zone C - Shelf 1'),
('Desk Lamp LED', 'Furniture', 30, 'Zone B - Shelf 3');
```

### Shipment Sample Data
```sql
INSERT INTO Shipment (origin, destination, status, expectedDeliveryDate, itemId) VALUES
('Supplier TechCorp', 'Warehouse', 'Received', '2024-01-15 10:00:00', 1),
('Warehouse', 'Office Building A', 'Dispatched', '2024-01-20 14:00:00', 1),
('Supplier OfficeMax', 'Warehouse', 'Received', '2024-01-16 09:00:00', 2),
('Warehouse', 'Branch Office B', 'In Transit', '2024-01-22 16:00:00', 3);
```

### Space Sample Data
```sql
INSERT INTO Space (totalCapacity, usedCapacity, availableCapacity, zone) VALUES
(1000, 300, 700, 'Zone A'),
(800, 200, 600, 'Zone B'),
(600, 150, 450, 'Zone C'),
(1200, 400, 800, 'Zone D');
```

### Maintenance Sample Data
```sql
INSERT INTO Maintenance (equipmentId, taskDescription, scheduledDate, completionStatus) VALUES
(101, 'Monthly inspection of forklift', '2024-01-15 09:00:00', 'Scheduled'),
(102, 'Quarterly maintenance of conveyor belt', '2024-01-20 10:00:00', 'Scheduled'),
(103, 'Weekly safety check of loading dock', '2024-01-18 08:00:00', 'Completed');
```

### Report Sample Data
```sql
INSERT INTO Report (reportType, details) VALUES
('Inventory Summary', 'Monthly inventory summary report for January 2024. Total items: 6, Total value: $45,000'),
('Shipment Analysis', 'Weekly shipment analysis. Incoming: 2, Outgoing: 2, In Transit: 1'),
('Space Utilization', 'Current space utilization: 75%. Zone A: 70%, Zone B: 75%, Zone C: 80%');
```

## Database Scripts

### Complete Database Creation
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS lwms
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE lwms;

-- Create tables (all CREATE TABLE statements from above)
-- ... (include all table creation scripts)

-- Insert sample data
-- ... (include all INSERT statements from above)
```

### Backup Script
```bash
#!/bin/bash
# Database backup script
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p lwms > backup_lwms_$DATE.sql
echo "Backup completed: backup_lwms_$DATE.sql"
```

### Restore Script
```bash
#!/bin/bash
# Database restore script
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.sql>"
    exit 1
fi
mysql -u root -p lwms < $1
echo "Database restored from $1"
```

## Migration Guide

### Version 1.0 to 1.1 (Future)
```sql
-- Add new fields
ALTER TABLE Inventory ADD COLUMN unitPrice DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE Inventory ADD COLUMN supplier VARCHAR(255);

-- Add new indexes
CREATE INDEX idx_unit_price ON Inventory(unitPrice);
CREATE INDEX idx_supplier ON Inventory(supplier);

-- Update existing data
UPDATE Inventory SET unitPrice = 0.00 WHERE unitPrice IS NULL;
```

### Version 1.1 to 1.2 (Future)
```sql
-- Add audit fields
ALTER TABLE Inventory ADD COLUMN createdBy VARCHAR(100);
ALTER TABLE Inventory ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Inventory ADD COLUMN updatedBy VARCHAR(100);

-- Add soft delete
ALTER TABLE Inventory ADD COLUMN isDeleted BOOLEAN DEFAULT FALSE;
CREATE INDEX idx_is_deleted ON Inventory(isDeleted);
```

## Performance Optimization

### Query Optimization Tips
1. **Use Indexes**: Always use indexed columns in WHERE clauses
2. **Limit Results**: Use LIMIT for large datasets
3. **Avoid SELECT ***: Select only needed columns
4. **Use Prepared Statements**: For repeated queries
5. **Monitor Slow Queries**: Use MySQL slow query log

### Maintenance Tasks
```sql
-- Analyze table statistics
ANALYZE TABLE Inventory, Shipment, Space, Maintenance, Report;

-- Optimize tables
OPTIMIZE TABLE Inventory, Shipment, Space, Maintenance, Report;

-- Check table status
CHECK TABLE Inventory, Shipment, Space, Maintenance, Report;
```

## Security Considerations

### Access Control
```sql
-- Create application user
CREATE USER 'lwms_app'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant minimal privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON lwms.* TO 'lwms_app'@'localhost';

-- Revoke dangerous privileges
REVOKE DROP, CREATE, ALTER ON lwms.* FROM 'lwms_app'@'localhost';
```

### Data Encryption
- **At Rest**: Consider MySQL Enterprise Encryption
- **In Transit**: Use SSL/TLS connections
- **Application Level**: Encrypt sensitive data before storage

## Monitoring and Maintenance

### Health Checks
```sql
-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'lwms'
ORDER BY (data_length + index_length) DESC;

-- Check index usage
SELECT 
    table_name,
    index_name,
    cardinality
FROM information_schema.statistics 
WHERE table_schema = 'lwms'
ORDER BY table_name, index_name;
```

### Backup Strategy
- **Full Backup**: Daily at 2:00 AM
- **Incremental Backup**: Every 4 hours
- **Retention**: 30 days for full backups, 7 days for incremental
- **Testing**: Weekly restore tests

---

**Database Version**: 1.0  
**Last Updated**: January 2024  
**Compatibility**: MySQL 8.0+  
**Next Version**: 1.1 (Planned) 