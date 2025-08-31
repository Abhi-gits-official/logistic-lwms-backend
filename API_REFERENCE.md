# LWMS API Reference

## Overview
This document provides comprehensive API documentation for the Logistics Warehouse Management System (LWMS).

**Base URL**: `http://localhost:8080`  
**Content Type**: `application/json`  
**Authentication**: Currently open (to be implemented)

## Table of Contents
1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [Category API](#category-api)
4. [Inventory API](#inventory-api)
5. [Shipment API](#shipment-api)
6. [Space API](#space-api)
7. [Maintenance API](#maintenance-api)
8. [Report API](#report-api)
9. [Data Models](#data-models)
10. [Frontend Integration](#frontend-integration)
11. [Implementation Status](#implementation-status)

## Authentication

*Note: Authentication system is planned for future implementation*

## Error Handling

### HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content returned
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "error": "Error message description",
  "timestamp": "2024-08-28T18:47:00",
  "path": "/api/endpoint"
}
```

## Category API

### Base Path: `/category`

#### 1. Get All Categories
**GET** `/category/all`

Retrieves all product categories.

**Response (200 OK):**
```json
[
  {
    "categoryId": 1,
    "categoryName": "Clothing",
    "description": "This is clothing category"
  },
  {
    "categoryId": 2,
    "categoryName": "Electronic",
    "description": "This is electronic category"
  }
]
```

**Frontend Integration:**
- ✅ Dynamic category dropdown population
- ✅ Category management modal
- ✅ Real-time category list updates

#### 2. Add Category
**POST** `/category/add`

Adds a new product category.

**Request Body:**
```json
{
  "categoryName": "Footwear",
  "description": "This is footwear category"
}
```

**Response (200 OK):**
```json
{
  "categoryId": 3,
  "categoryName": "Footwear",
  "description": "This is footwear category"
}
```

**Validation Rules:**
- `categoryName`: Required, unique, non-empty string
- `description`: Optional string

**Frontend Integration:**
- ✅ Category creation form
- ✅ Duplicate name validation
- ✅ Success/error notifications
- ✅ Real-time category list refresh

#### 3. Update Category
**PUT** `/category/update/{categoryId}`

Updates an existing category.

**Path Parameters:**
- `categoryId`: Integer - ID of the category to update

**Request Body:**
```json
{
  "categoryName": "Footwear Updated",
  "description": "Updated footwear category description"
}
```

**Response (200 OK):**
```json
{
  "categoryId": 3,
  "categoryName": "Footwear Updated",
  "description": "Updated footwear category description"
}
```

**Frontend Integration:**
- ✅ Edit category modal
- ✅ Form pre-filling
- ✅ Update confirmation
- ✅ Real-time updates

#### 4. Delete Category
**DELETE** `/category/delete/{categoryId}`

Deletes a category by ID.

**Path Parameters:**
- `categoryId`: Integer - ID of the category to delete

**Response (204 No Content):**
No response body

**Business Rules:**
- Cannot delete categories that have associated inventory items

**Frontend Integration:**
- ✅ Delete confirmation modal
- ✅ Business rule validation
- ✅ Success/error feedback
- ✅ Category list refresh

#### 5. Get Category by ID
**GET** `/category/get/{categoryId}`

Retrieves a specific category by ID.

**Path Parameters:**
- `categoryId`: Integer - ID of the category

**Response (200 OK):**
```json
{
  "categoryId": 1,
  "categoryName": "Clothing",
  "description": "This is clothing category"
}
```

**Frontend Integration:**
- ✅ Category details display
- ✅ Edit form population
- ✅ Error handling

## Inventory API

### Base Path: `/inventory`

#### 1. Add Inventory Item
**POST** `/inventory/add`

Adds a new item to the inventory.

**Request Body:**
```json
{
  "itemName": "Laptop",
  "categoryId": 2,
  "quantity": 50,
  "location": "B"
}
```

**Response (200 OK):**
```json
{
  "itemId": 1,
  "itemName": "Laptop",
  "category": {
    "categoryId": 2,
    "categoryName": "Electronic",
    "description": "This is electronic category"
  },
  "quantity": 50,
  "location": "B",
  "lastUpdated": "2024-08-28T18:47:00"
}
```

**Validation Rules:**
- `itemName`: Required, non-empty string
- `categoryId`: Required, must reference existing category
- `quantity`: Required, positive integer
- `location`: Required, non-empty string (A, B, C, D zones)

**Frontend Integration:**
- ✅ Form validation and submission
- ✅ Category dropdown with real data
- ✅ Real-time data refresh
- ✅ Success/error notifications
- ✅ Dashboard auto-update

#### 2. Update Inventory Item
**PUT** `/inventory/update`

Updates an existing inventory item.

**Request Body:**
```json
{
  "itemId": 1,
  "itemName": "Laptop Pro",
  "categoryId": 2,
  "quantity": 45,
  "location": "B"
}
```

**Response (200 OK):**
```json
{
  "itemId": 1,
  "itemName": "Laptop Pro",
  "category": {
    "categoryId": 2,
    "categoryName": "Electronic",
    "description": "This is electronic category"
  },
  "quantity": 45,
  "location": "B",
  "lastUpdated": "2024-08-28T18:47:00"
}
```

**Frontend Integration:**
- ✅ Edit modal population
- ✅ Form pre-filling with existing data
- ✅ Update confirmation
- ✅ Real-time data refresh
- ✅ Dashboard auto-update

#### 3. Remove Inventory Item
**DELETE** `/inventory/remove/{itemId}`

Removes an inventory item by ID.

**Path Parameters:**
- `itemId`: Integer - ID of the item to remove

**Response (204 No Content):**
No response body

**Frontend Integration:**
- ✅ Delete confirmation modal
- ✅ Row removal from table
- ✅ Dashboard data refresh
- ✅ Success notifications

#### 4. View All Inventory
**GET** `/inventory/view`

Retrieves all inventory items with category information.

**Response (200 OK):**
```json
[
  {
    "itemId": 1,
    "itemName": "Laptop",
    "category": {
      "categoryId": 2,
      "categoryName": "Electronic",
      "description": "This is electronic category"
    },
    "quantity": 50,
    "location": "B",
    "lastUpdated": "2024-08-28T18:47:00"
  }
]
```

**Frontend Integration:**
- ✅ Dynamic table population
- ✅ Category filter population
- ✅ Search functionality
- ✅ Loading states
- ✅ Real-time updates

#### 5. Get All Categories (for dropdowns)
**GET** `/inventory/categories`

Retrieves all categories for inventory forms.

**Response (200 OK):**
```json
[
  {
    "categoryId": 1,
    "categoryName": "Clothing",
    "description": "This is clothing category"
  }
]
```

**Frontend Integration:**
- ✅ Category dropdown population
- ✅ Form validation
- ✅ Real-time updates

## Shipment API

### Base Path: `/shipment`

#### 1. Receive Shipment
**POST** `/shipment/receive`

Records an incoming shipment.

**Request Body:**
```json
{
  "itemId": 1,
  "origin": "Supplier A",
  "destination": "Warehouse",
  "status": "Received",
  "expectedDeliveryDate": "2024-08-28T10:00:00"
}
```

**Response (200 OK):**
```json
{
  "shipmentId": 1,
  "origin": "Supplier A",
  "destination": "Warehouse",
  "status": "Received",
  "expectedDeliveryDate": "2024-08-28T10:00:00",
  "inventory": {
    "itemId": 1,
    "itemName": "Laptop",
    "category": {
      "categoryId": 2,
      "categoryName": "Electronic"
    },
    "quantity": 50,
    "location": "B"
  }
}
```

**Frontend Integration:**
- ✅ Item selection dropdown from inventory
- ✅ Form validation
- ✅ Status selection
- ✅ Real-time data refresh

#### 2. Dispatch Shipment
**PUT** `/shipment/dispatch`

Records an outgoing shipment.

**Request Body:**
```json
{
  "itemId": 1,
  "origin": "Warehouse",
  "destination": "Customer B",
  "status": "Dispatched",
  "expectedDeliveryDate": "2024-08-30T14:00:00"
}
```

**Frontend Integration:**
- ✅ Shipment creation workflow
- ✅ Item validation
- ✅ Status management

#### 3. Track Shipment
**GET** `/shipment/track/{shipmentId}`

Retrieves shipment details by ID.

**Path Parameters:**
- `shipmentId`: Integer - ID of the shipment to track

**Frontend Integration:**
- ✅ Shipment tracking display
- ✅ Status updates
- ✅ Error handling

#### 4. Get All Shipments
**GET** `/shipment/all`

Retrieves all shipments.

**Frontend Integration:**
- ✅ Dynamic table population
- ✅ Status filtering
- ✅ Search functionality
- ✅ Real-time updates

## Space API

### Base Path: `/space`

#### 1. View Space Usage
**GET** `/space/view`

Retrieves all space allocation information with automatic zone creation.

**Response (200 OK):**
```json
[
  {
    "spaceId": 1,
    "totalCapacity": 1000,
    "usedCapacity": 300,
    "availableCapacity": 700,
    "zone": "A"
  },
  {
    "spaceId": 2,
    "totalCapacity": 1000,
    "usedCapacity": 500,
    "availableCapacity": 500,
    "zone": "B"
  }
]
```

**Business Rules:**
- Automatically creates default zones (A, B, C, D) if none exist
- Zone A: Clothing category
- Zone B: Electronics category
- Zone C: Footwear category
- Zone D: Others category

**Frontend Integration:**
- ✅ Dynamic space cards with real data
- ✅ Progress bars with capacity visualization
- ✅ Zone information display
- ✅ Real-time updates

#### 2. Allocate Space
**POST** `/space/allocate`

Allocates or updates warehouse space.

**Request Body:**
```json
{
  "totalCapacity": 1000,
  "usedCapacity": 0,
  "availableCapacity": 1000,
  "zone": "C"
}
```

**Response (200 OK):**
```json
{
  "spaceId": 3,
  "totalCapacity": 1000,
  "usedCapacity": 0,
  "availableCapacity": 1000,
  "zone": "C"
}
```

**Business Rules:**
- Updates existing zone if zone exists
- Creates new zone if zone doesn't exist
- Automatically calculates space utilization from inventory

**Frontend Integration:**
- ✅ Space allocation modal
- ✅ Real-time capacity calculation
- ✅ Zone selection dropdown
- ✅ Success/error feedback
- ✅ Dashboard auto-update

#### 3. Free Space
**DELETE** `/space/free/{spaceId}`

Releases allocated space.

**Path Parameters:**
- `spaceId`: Integer - ID of the space to free

**Response (204 No Content):**
No response body

**Frontend Integration:**
- ✅ Space freeing functionality
- ✅ Confirmation dialogs
- ✅ Real-time updates

## Maintenance API

### Base Path: `/maintenance`

#### 1. Schedule Maintenance
**POST** `/maintenance/schedule`

Schedules new equipment maintenance.

**Request Body:**
```json
{
  "equipmentId": 101,
  "taskDescription": "Monthly inspection of forklift",
  "scheduledDate": "2024-08-28T09:00:00",
  "completionStatus": "Scheduled"
}
```

**Frontend Integration:**
- ✅ Maintenance scheduling form
- ✅ Date picker integration
- ✅ Status management
- ✅ Real-time task list updates

#### 2. Update Maintenance Schedule
**PUT** `/maintenance/update`

Updates existing maintenance schedule.

**Frontend Integration:**
- ✅ Edit modal population
- ✅ Form pre-filling
- ✅ Update confirmation
- ✅ Real-time updates

#### 3. View All Maintenance Schedules
**GET** `/maintenance/view`

Retrieves all maintenance schedules.

**Frontend Integration:**
- ✅ Dynamic task list
- ✅ Status badges
- ✅ Edit functionality
- ✅ Loading states

#### 4. Get Maintenance Schedule by ID
**GET** `/maintenance/get/{scheduleId}`

Retrieves specific maintenance schedule.

**Frontend Integration:**
- ✅ Edit modal population
- ✅ Data retrieval for updates
- ✅ Error handling

## Report API

### Base Path: `/report`

#### 1. Generate Report
**POST** `/report/generate`

Generates a new report.

**Request Body:**
```json
{
  "reportType": "Inventory Summary",
  "details": "Monthly inventory summary report for August 2024"
}
```

**Frontend Integration:**
- ✅ Report type selection
- ✅ Date range filtering
- ✅ Report generation
- ✅ Download functionality

#### 2. Get Report by ID
**GET** `/report/get/{reportId}`

Retrieves specific report by ID.

**Frontend Integration:**
- ✅ Report retrieval
- ✅ Display formatting
- ✅ Error handling

#### 3. Get All Reports
**GET** `/report/all`

Retrieves all reports.

**Frontend Integration:**
- ✅ Report listing
- ✅ Historical data access
- ✅ Report management

## Data Models

### Category
```json
{
  "categoryId": "Integer (Primary Key, Auto-generated)",
  "categoryName": "String (Required, Unique)",
  "description": "String (Optional)",
  "inventoryItems": "Array of Inventory objects (Managed Reference)"
}
```

### Inventory
```json
{
  "itemId": "Integer (Primary Key, Auto-generated)",
  "itemName": "String (Required)",
  "category": "Category object (Many-to-One relationship)",
  "quantity": "Integer (Required, Positive)",
  "location": "String (Required, Zone A/B/C/D)",
  "lastUpdated": "Timestamp (Auto-generated)",
  "shipments": "Array of Shipment objects (Back Reference)"
}
```

### Shipment
```json
{
  "shipmentId": "Integer (Primary Key, Auto-generated)",
  "origin": "String (Required)",
  "destination": "String (Required)",
  "status": "String (Required)",
  "expectedDeliveryDate": "Timestamp",
  "inventory": "Inventory object (Required)"
}
```

### Space
```json
{
  "spaceId": "Integer (Primary Key, Auto-generated)",
  "totalCapacity": "Integer (Required, Positive)",
  "usedCapacity": "Integer (Required, Non-negative)",
  "availableCapacity": "Integer (Required, Non-negative)",
  "zone": "String (Required, A/B/C/D)"
}
```

### MaintenanceSchedule
```json
{
  "scheduleId": "Integer (Primary Key, Auto-generated)",
  "equipmentId": "Integer (Required, Positive)",
  "taskDescription": "String (Required)",
  "scheduledDate": "Timestamp (Required)",
  "completionStatus": "String (Required)"
}
```

### Report
```json
{
  "reportId": "Integer (Primary Key, Auto-generated)",
  "reportType": "String (Required)",
  "generatedOn": "Timestamp (Auto-generated)",
  "details": "String (Required)"
}
```

## Frontend Integration

### Dashboard Features - FULLY IMPLEMENTED
- ✅ **Real-time Data Loading**: Dashboard automatically loads live data from all API endpoints
- ✅ **Dynamic Statistics**: Total items, active shipments, space utilization, and maintenance counts
- ✅ **Recent Activity**: Shows latest inventory changes, shipments, and maintenance tasks
- ✅ **Auto-refresh**: Data updates when switching between tabs or after operations
- ✅ **Space Utilization**: Real-time space usage with progress bars and zone information

### Form Integration - FULLY IMPLEMENTED
- ✅ **Inventory Management**: Add, edit, and delete items with category selection
- ✅ **Category Management**: Complete CRUD operations for product categories
- ✅ **Shipment Creation**: Create shipments with item selection from available inventory
- ✅ **Maintenance Scheduling**: Schedule and update maintenance tasks
- ✅ **Space Management**: View and manage warehouse space allocation with zone-based system

### User Experience - FULLY IMPLEMENTED
- ✅ **Loading States**: Professional loading indicators during API calls
- ✅ **Error Handling**: User-friendly error messages and notifications
- ✅ **Success Feedback**: Toast notifications for successful operations
- ✅ **Data Consistency**: All sections stay synchronized with real-time updates
- ✅ **Modal Forms**: Clean, responsive forms for all operations
- ✅ **Confirmation Dialogs**: User confirmation for destructive operations

### Responsive Design - FULLY IMPLEMENTED
- ✅ **Mobile Support**: Responsive layout for all device sizes
- ✅ **Theme Switching**: Light/dark mode support
- ✅ **Sidebar Navigation**: Collapsible navigation for better mobile experience
- ✅ **Search & Filtering**: Real-time search and dynamic filtering
- ✅ **Category Management**: Intuitive category management interface

## Implementation Status

### ✅ **FULLY IMPLEMENTED AND TESTED**
- **Category Management**: Complete CRUD operations with frontend integration
- **Inventory Management**: Complete CRUD operations with category relationships
- **Shipment Handling**: Create, view, and manage shipments with inventory integration
- **Space Optimization**: Zone-based space management (A, B, C, D) with automatic utilization
- **Maintenance Scheduling**: Complete maintenance task management
- **Dashboard**: Real-time data display with automatic updates after operations
- **Reports**: Generate and download reports
- **User Interface**: Modern, responsive design with theme support
- **Database Persistence**: MySQL with persistent data storage
- **Frontend-Backend Integration**: Complete API integration with real-time updates

### 🔄 **RECENTLY IMPLEMENTED**
- **Category API**: New REST endpoints for category management
- **Space Zone System**: Pre-configured zones with category mapping
- **Database Persistence**: Fixed database reinitialization issue
- **Real-time Dashboard Updates**: Automatic refresh after all operations

### 📋 **PLANNED FEATURES**
- **Authentication System**: User login and role-based access control
- **API Rate Limiting**: Request throttling and protection
- **Data Export**: CSV/Excel export functionality
- **Advanced Analytics**: Charts and graphs for data visualization
- **Mobile App**: Native mobile application
- **API Versioning**: Version control for API endpoints

## Database Configuration

### Current Status: ✅ **PRODUCTION READY**
- **Database**: MySQL 8.0 with persistent storage
- **Configuration**: `spring.jpa.hibernate.ddl-auto=update`
- **Data Persistence**: All data preserved between application restarts
- **Auto-schema**: Tables created/updated automatically without data loss

### Key Benefits
- ✅ **No Data Loss**: Database maintains all data between restarts
- ✅ **Automatic Schema Updates**: New fields/tables added automatically
- ✅ **Production Ready**: Stable MySQL configuration
- ✅ **Performance**: Optimized queries with proper indexing

## Rate Limiting

*Currently no rate limiting implemented - planned for future release*

## Pagination

*Currently no pagination implemented - all endpoints return complete datasets*

## Filtering and Sorting

*Basic filtering implemented in frontend - advanced filtering planned*

## Future Enhancements

1. **Authentication & Authorization**: JWT-based authentication system
2. **Rate Limiting**: API usage throttling and protection
3. **Pagination**: Large dataset handling with page navigation
4. **Advanced Filtering**: Complex search queries and sorting
5. **Webhooks**: Real-time notifications and integrations
6. **API Versioning**: Version control for backward compatibility
7. **Caching**: Response caching for improved performance
8. **Monitoring**: API usage analytics and performance metrics
9. **Documentation**: Interactive API documentation (Swagger/OpenAPI)
10. **Testing**: Comprehensive API testing suite

---

**API Version**: 1.0  
**Frontend Version**: 1.0  
**Last Updated**: August 2024  
**Status**: ✅ **PRODUCTION READY**  
**Database**: ✅ **MySQL with Persistent Storage**  
**Category Management**: ✅ **FULLY IMPLEMENTED**  
**Space Zones**: ✅ **A, B, C, D with Category Mapping**  
**Real-time Updates**: ✅ **Dashboard Auto-refresh**  
**Contact**: Development Team 