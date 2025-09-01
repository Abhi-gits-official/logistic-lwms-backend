// API Configuration
const API_BASE_URL = 'http://localhost:8080';
const API_ENDPOINTS = {
    // Inventory API
    INVENTORY: {
        ADD: '/inventory/add',
        UPDATE: '/inventory/update',
        REMOVE: '/inventory/remove',
        VIEW: '/inventory/view',
        CATEGORIES: '/inventory/categories'
    },
    // Category API
    CATEGORY: {
        ALL: '/category/all',
        ADD: '/category/add',
        UPDATE: '/category/update',
        DELETE: '/category/delete',
        GET: '/category'
    },
    // Shipment API
    SHIPMENT: {
        RECEIVE: '/shipment/receive',
        DISPATCH: '/shipment/dispatch',
        TRACK: '/shipment/track',
        ALL: '/shipment/all',
        DELETE: '/shipment/delete'
    },
    // Space API
    SPACE: {
        VIEW: '/space/view',
        ALLOCATE: '/space/allocate',
        FREE: '/space/free'
    },
    // Maintenance API
    MAINTENANCE: {
        SCHEDULE: '/maintenance/schedule',
        UPDATE: '/maintenance/update',
        VIEW: '/maintenance/view',
        GET: '/maintenance/get'
    },
    // Report API
    REPORT: {
        GENERATE: '/report/generate',
        GET: '/report/get',
        ALL: '/report/all'
    }
};

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    console.error('Error details:', e);
});

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const themeSwitch = document.getElementById('theme-switch');
const userBtn = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');
const loadingSpinner = document.getElementById('loading-spinner');
const toastContainer = document.getElementById('toast-container');
// Modal Elements
const itemModal = document.getElementById('item-modal');
const shipmentModal = document.getElementById('shipment-modal');
const maintenanceModal = document.getElementById('maintenance-modal');
const confirmModal = document.getElementById('confirm-modal');
// Form Elements
const itemForm = document.getElementById('item-form');
const shipmentForm = document.getElementById('shipment-form');
const maintenanceForm = document.getElementById('maintenance-form');
// Search Elements
const globalSearch = document.getElementById('global-search');
const inventorySearch = document.getElementById('inventory-search');
const shipmentSearch = document.getElementById('shipment-search');
// Filter Elements
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');
// Table Elements
const inventoryTable = document.getElementById('inventory-table');
const shipmentTable = document.getElementById('shipment-table');
// Report Elements
const reportType = document.getElementById('report-type');
const dateRange = document.getElementById('date-range');
const generateReportBtn = document.getElementById('generate-report-btn');
const downloadReportBtn = document.getElementById('download-report-btn');
const reportPreview = document.getElementById('report-preview');
// Calendar Elements
const calendarGrid = document.getElementById('calendar-grid');
const currentMonth = document.getElementById('current-month');
const prevMonth = document.getElementById('prev-month');
const nextMonth = document.getElementById('next-month');

console.log('DOM elements found:', {
    sidebar: !!sidebar,
    sidebarToggle: !!sidebarToggle,
    navItems: navItems.length,
    contentSections: contentSections.length,
    themeSwitch: !!themeSwitch,
    userBtn: !!userBtn,
    userDropdown: !!userDropdown,
    loadingSpinner: !!loadingSpinner,
    toastContainer: !!toastContainer
});

// API Utility Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const url = API_BASE_URL + endpoint;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null; // No content
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Dashboard Data Loading Functions
async function loadDashboardData() {
    try {
        showLoading();
        
        // Load inventory count
        const inventoryData = await apiCall(API_ENDPOINTS.INVENTORY.VIEW);
        const totalItems = inventoryData ? inventoryData.length : 0;
        document.getElementById('total-items').textContent = totalItems.toLocaleString();
        document.getElementById('items-change').textContent = `Total items in system`;
        
        // Load shipment count
        const shipmentData = await apiCall(API_ENDPOINTS.SHIPMENT.ALL);
        const activeShipments = shipmentData ? shipmentData.filter(s => s.status === 'Pending' || s.status === 'In Transit').length : 0;
        document.getElementById('active-shipments').textContent = activeShipments;
        document.getElementById('shipments-change').textContent = `Active shipments`;
        
        // Load space utilization
        const spaceData = await apiCall(API_ENDPOINTS.SPACE.VIEW);
        if (spaceData && spaceData.length > 0) {
            const totalCapacity = spaceData.reduce((sum, space) => sum + space.totalCapacity, 0);
            const usedCapacity = spaceData.reduce((sum, space) => sum + space.usedCapacity, 0);
            const utilization = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;
            document.getElementById('space-utilization').textContent = `${utilization}%`;
            document.getElementById('space-change').textContent = utilization > 80 ? 'High usage' : utilization > 50 ? 'Optimal range' : 'Low usage';
        } else {
            document.getElementById('space-utilization').textContent = '0%';
            document.getElementById('space-change').textContent = 'No space data';
        }
        
        // Load maintenance count
        const maintenanceData = await apiCall(API_ENDPOINTS.MAINTENANCE.VIEW);
        const pendingMaintenance = maintenanceData ? maintenanceData.filter(m => m.completionStatus === 'Pending').length : 0;
        document.getElementById('maintenance-due').textContent = pendingMaintenance;
        document.getElementById('maintenance-change').textContent = `${pendingMaintenance} pending tasks`;
        
        // Load recent activity
        await loadRecentActivity();
        
        // Load quick stats
        await loadQuickStats();
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
    } finally {
        hideLoading();
    }
}

async function loadRecentActivity() {
    try {
        const recentActivity = document.getElementById('recent-activity');
        recentActivity.innerHTML = '<div class="activity-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Loading recent activity...</p></div>';
        
        // Get recent inventory changes
        const inventoryData = await apiCall(API_ENDPOINTS.INVENTORY.VIEW);
        const shipmentsData = await apiCall(API_ENDPOINTS.SHIPMENT.ALL);
        const maintenanceData = await apiCall(API_ENDPOINTS.MAINTENANCE.VIEW);
        
        let activities = [];
        
        // Add recent inventory activities
        if (inventoryData && inventoryData.length > 0) {
            const recentInventory = inventoryData.slice(0, 2);
            recentInventory.forEach(item => {
                activities.push({
                    icon: 'fas fa-plus',
                    text: `Item: ${item.itemName} (Qty: ${item.quantity})`,
                    time: formatTimeAgo(new Date(item.lastUpdated))
                });
            });
        }
        
        // Add recent shipment activities
        if (shipmentsData && shipmentsData.length > 0) {
            const recentShipments = shipmentsData.slice(0, 2);
            recentShipments.forEach(shipment => {
                activities.push({
                    icon: 'fas fa-shipping-fast',
                    text: `Shipment: ${shipment.shipmentId} - ${shipment.status}`,
                    time: formatTimeAgo(new Date(shipment.expectedDeliveryDate))
                });
            });
        }
        
        // Add recent maintenance activities
        if (maintenanceData && maintenanceData.length > 0) {
            const recentMaintenance = maintenanceData.slice(0, 1);
            recentMaintenance.forEach(maintenance => {
                activities.push({
                    icon: 'fas fa-tools',
                    text: `Maintenance: ${maintenance.taskDescription}`,
                    time: formatTimeAgo(new Date(maintenance.scheduledDate))
                });
            });
        }
        
        // Sort activities by time and take top 3
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        activities = activities.slice(0, 3);
        
        if (activities.length > 0) {
            recentActivity.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <p>${activity.text}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        } else {
            recentActivity.innerHTML = '<div class="activity-placeholder"><p>No recent activity</p></div>';
        }
        
    } catch (error) {
        console.error('Failed to load recent activity:', error);
        document.getElementById('recent-activity').innerHTML = '<div class="activity-placeholder"><p>Failed to load activity</p></div>';
    }
}

async function loadQuickStats() {
    try {
        // Load inventory stats
        const inventoryData = await apiCall(API_ENDPOINTS.INVENTORY.VIEW);
        const totalItems = inventoryData ? inventoryData.length : 0;
        document.getElementById('stat-total-items').textContent = totalItems.toLocaleString();
        document.getElementById('stat-items-change').textContent = `Total items`;
        
        // Load shipment stats
        const shipmentData = await apiCall(API_ENDPOINTS.SHIPMENT.ALL);
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const monthlyShipments = shipmentData ? shipmentData.filter(s => {
            const shipmentDate = new Date(s.expectedDeliveryDate);
            return shipmentDate.getMonth() === thisMonth && shipmentDate.getFullYear() === thisYear;
        }).length : 0;
        document.getElementById('stat-shipments-month').textContent = monthlyShipments;
        document.getElementById('stat-shipments-change').textContent = `This month`;
        
        // Load space stats
        const spaceData = await apiCall(API_ENDPOINTS.SPACE.VIEW);
        if (spaceData && spaceData.length > 0) {
            const totalCapacity = spaceData.reduce((sum, space) => sum + space.totalCapacity, 0);
            const usedCapacity = spaceData.reduce((sum, space) => sum + space.usedCapacity, 0);
            const utilization = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;
            document.getElementById('stat-space-util').textContent = `${utilization}%`;
            document.getElementById('stat-space-change').textContent = utilization > 80 ? 'High' : utilization > 50 ? 'Optimal' : 'Low';
        } else {
            document.getElementById('stat-space-util').textContent = '0%';
            document.getElementById('stat-space-change').textContent = 'No data';
        }
        
        // Load maintenance stats
        const maintenanceData = await apiCall(API_ENDPOINTS.MAINTENANCE.VIEW);
        const completedMaintenance = maintenanceData ? maintenanceData.filter(m => m.completionStatus === 'Completed').length : 0;
        document.getElementById('stat-maintenance-completed').textContent = completedMaintenance;
        document.getElementById('stat-maintenance-change').textContent = `Completed`;
        
    } catch (error) {
        console.error('Failed to load quick stats:', error);
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
});

function initializeApp() {
    // Initialize sidebar
    if (sidebar && sidebarToggle) {
        initializeSidebar();
    }
    
    // Initialize navigation
    if (navItems.length > 0) {
        initializeNavigation();
    }
    
    // Initialize theme
    if (themeSwitch) {
        initializeTheme();
    }
    
    // Initialize user menu
    if (userBtn && userDropdown) {
        initializeUserMenu();
    }
    
    // Initialize search functionality
    if (globalSearch) {
        initializeSearch();
    }
    
    // Initialize filters
    if (categoryFilter || statusFilter) {
        initializeFilters();
    }
    
    // Initialize modals
    if (itemModal || shipmentModal || maintenanceModal || confirmModal) {
        initializeModals();
    }
    
    // Initialize forms
    if (itemForm || shipmentForm || maintenanceForm) {
        initializeForms();
    }
    
    // Initialize calendar
    if (calendarGrid) {
        initializeCalendar();
    }
    
    // Initialize reports
    if (reportType || generateReportBtn) {
        initializeReports();
    }
    
    // Show loading spinner briefly
    if (loadingSpinner) {
        showLoading();
        setTimeout(hideLoading, 1000);
    }
    
    // Load initial dashboard data
    loadDashboardData();
}
// Sidebar Functionality
function initializeSidebar() {
  if (!sidebarToggle || !sidebar) return;
  
  sidebarToggle.addEventListener('click', toggleSidebar);

  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    }
  });
}

function toggleSidebar() {
  if (!sidebar) return;
  
  sidebar.classList.toggle('collapsed');

  if (window.innerWidth <= 1024) {
    sidebar.classList.toggle('show');
  }
}

function toggleSidebar() {
  if (!sidebar) return;
  
  if (window.innerWidth <= 1024) {
    // Mobile: toggle show/hide
    sidebar.classList.toggle('show');
    if (sidebarOverlay) {
      sidebarOverlay.classList.toggle('show');
    }
  } else {
    // Desktop: toggle collapse/expand
    sidebar.classList.toggle('collapsed');
  }
}

// Navigation Functionality
function initializeNavigation() {
  if (!navItems || navItems.length === 0) return;
  
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Show corresponding content section
      const tabName = this.getAttribute('data-tab');
      showContentSection(tabName);
      
      // Close sidebar on mobile
      if (window.innerWidth <= 1024 && sidebar) {
        sidebar.classList.remove('show');
      }
    });
  });
}
function showContentSection(tabName) {
 // Hide all content sections
 contentSections.forEach(section => {
 section.classList.remove('active');
 });
 
 // Show selected section
 const targetSection = document.getElementById(tabName);
 if (targetSection) {
 targetSection.classList.add('active');
 }
 
 // Load data for the selected section
 switch(tabName) {
 case 'inventory':
     loadInventoryData();
     break;
 case 'shipment':
     loadShipmentData();
     break;
 case 'space':
     loadSpaceData();
     break;
 case 'maintenance':
     loadMaintenanceData();
     break;
 case 'reports':
     // Reports are loaded on demand
     break;
 }
}
// Theme Functionality
function initializeTheme() {
  if (!themeSwitch) return;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.className = savedTheme;
    themeSwitch.checked = savedTheme === 'dark-mode';
  }
  
  themeSwitch.addEventListener('change', toggleTheme);
}

function toggleTheme() {
  if (!themeSwitch) return;
  
  if (themeSwitch.checked) {
    document.body.className = 'dark-mode';
    localStorage.setItem('theme', 'dark-mode');
    showToast('Dark mode enabled', 'success');
  } else {
    document.body.className = 'light-mode';
    localStorage.setItem('theme', 'light-mode');
    showToast('Light mode enabled', 'success');
  }
}

// User Menu Functionality
function initializeUserMenu() {
  if (!userBtn || !userDropdown) return;
  
  userBtn.addEventListener('click', toggleUserDropdown);
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!userBtn.contains(e.target)) {
      userDropdown.classList.remove('show');
    }
  });
}

function toggleUserDropdown() {
  if (!userDropdown) return;
  
  userDropdown.classList.toggle('show');
}
// Search Functionality
function initializeSearch() {
  // Global search
  if (globalSearch) {
    globalSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      // Implement global search logic here
      console.log('Global search:', searchTerm);
    });
  }
  
  // Inventory search
  if (inventorySearch) {
    inventorySearch.addEventListener('input', function() {
      filterInventoryTable();
    });
  }
  
  // Shipment search
  if (shipmentSearch) {
    shipmentSearch.addEventListener('input', function() {
      filterShipmentTable();
    });
  }
}
function filterInventoryTable() {
    // Check if required elements exist
    if (!inventoryTable) {
        console.warn('Inventory table not found');
        return;
    }
    
    const searchTerm = (inventorySearch ? inventorySearch.value : '').toLowerCase();
    const categoryFilterValue = (categoryFilter ? categoryFilter.value : '');
    const rows = inventoryTable.querySelectorAll('tbody tr');
    
    console.log('Filtering inventory:', { searchTerm, categoryFilterValue, rowCount: rows.length });
    
                rows.forEach(row => {
                // Skip loading or error rows
                if (row.classList.contains('loading-row') || row.classList.contains('error-row') || row.classList.contains('no-data')) {
                    return;
                }
                
                const itemId = row.cells[0] ? row.cells[0].textContent.toLowerCase() : '';
                const itemName = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
                const category = row.cells[2] ? row.cells[2].textContent.toLowerCase() : '';
                const quantity = row.cells[3] ? row.cells[3].textContent : '';
                const location = row.cells[4] ? row.cells[4].textContent.toLowerCase() : '';
                
                const matchesSearch = !searchTerm || 
                    itemId.includes(searchTerm) || 
                    itemName.includes(searchTerm) || 
                    quantity.includes(searchTerm) || 
                    location.includes(searchTerm);
                
                const matchesCategory = !categoryFilterValue || 
                    category.includes(categoryFilterValue.toLowerCase());
                
                console.log('Row filtering:', { 
                    itemId, itemName, category, quantity, location, 
                    searchTerm, categoryFilterValue, 
                    matchesSearch, matchesCategory 
                });
                
                if (matchesSearch && matchesCategory) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
}
function filterShipmentTable() {
    // Check if required elements exist
    if (!shipmentTable) {
        console.warn('Shipment table not found');
        return;
    }
    
    const searchTerm = (shipmentSearch ? shipmentSearch.value : '').toLowerCase();
    const statusFilterValue = (statusFilter ? statusFilter.value : '');
    const rows = shipmentTable.querySelectorAll('tbody tr');
    
    console.log('Filtering shipments:', { searchTerm, statusFilterValue, rowCount: rows.length });
    
    rows.forEach(row => {
        // Skip loading or error rows
        if (row.classList.contains('loading-row') || row.classList.contains('error-row') || row.classList.contains('no-data')) {
            return;
        }
        
        const shipmentId = row.cells[0] ? row.cells[0].textContent.toLowerCase() : '';
        const itemId = row.cells[1] ? row.cells[1].textContent.toLowerCase() : '';
        const origin = row.cells[2] ? row.cells[2].textContent.toLowerCase() : '';
        const destination = row.cells[3] ? row.cells[3].textContent.toLowerCase() : '';
        const status = row.cells[4] ? row.cells[4].textContent.toLowerCase() : '';
        
        const matchesSearch = !searchTerm || 
            shipmentId.includes(searchTerm) || 
            itemId.includes(searchTerm) || 
            origin.includes(searchTerm) || 
            destination.includes(searchTerm);
        
        const matchesStatus = !statusFilterValue || 
            status.includes(statusFilterValue.toLowerCase());
        
        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
// Filter Functionality
function initializeFilters() {
    // Add event listeners for inventory filtering
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterInventoryTable);
    }
    if (inventorySearch) {
        inventorySearch.addEventListener('input', filterInventoryTable);
        inventorySearch.addEventListener('keyup', filterInventoryTable);
    }
    
    // Add event listeners for shipment filtering
    if (statusFilter) {
        statusFilter.addEventListener('change', filterShipmentTable);
    }
    if (shipmentSearch) {
        shipmentSearch.addEventListener('change', filterShipmentTable);
    }
}

// Inventory Management Functions
async function loadInventoryData() {
    try {
        const tbody = document.getElementById('inventory-tbody');
        tbody.innerHTML = '<tr><td colspan="6" class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading inventory data...</td></tr>';
        
        const inventoryData = await apiCall(API_ENDPOINTS.INVENTORY.VIEW);
        
        if (inventoryData && inventoryData.length > 0) {
            tbody.innerHTML = inventoryData.map(item => `
                <tr data-item-id="${item.itemId}">
                    <td>${item.itemId}</td>
                    <td>${item.itemName}</td>
                    <td><span class="category-badge ${item.category ? item.category.categoryName.toLowerCase().replace(/\s+/g, '-') : 'uncategorized'}">${item.category ? item.category.categoryName : 'Uncategorized'}</td>
                    <td>${item.quantity}</td>
                    <td>${item.location}</td>
                    <td>${new Date(item.lastUpdated).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-icon edit-btn" data-id="${item.itemId}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" data-id="${item.itemId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            // Populate category filter
            populateCategoryFilter(inventoryData);
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No inventory items found</td></tr>';
        }
        
        // Also populate category dropdowns for forms
        await populateCategoryDropdowns();
        
    } catch (error) {
        console.error('Failed to load inventory data:', error);
        document.getElementById('inventory-tbody').innerHTML = '<tr><td colspan="6" class="error-row">Failed to load inventory data</td></tr>';
        showToast('Failed to load inventory data', 'error');
    }
}

function populateCategoryFilter(inventoryData) {
    const categories = [...new Set(inventoryData.map(item => item.category ? item.category.categoryName : null).filter(Boolean))];
    const categoryFilter = document.getElementById('category-filter');
    
    if (!categoryFilter) {
        console.warn('Category filter element not found');
        return;
    }
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    // Add category options
    categories.forEach(categoryName => {
        const option = document.createElement('option');
        option.value = categoryName;
        option.textContent = categoryName;
        categoryFilter.appendChild(option);
    });
    
    console.log('Category filter populated with:', categories);
}

async function loadInventoryItemForEdit(itemId) {
    try {
        const inventoryData = await apiCall(API_ENDPOINTS.INVENTORY.VIEW);
        const item = inventoryData.find(i => i.itemId == itemId);
        
        if (item) {
            document.getElementById('item-name').value = item.itemName;
            document.getElementById('item-category').value = item.category ? item.category.categoryId : '';
            document.getElementById('item-quantity').value = item.quantity;
            document.getElementById('item-location').value = item.location;
            
            // Store item ID for update
            itemForm.dataset.editBtn = item.itemId;
        }
    } catch (error) {
        console.error('Failed to load item for edit:', error);
        showToast('Failed to load item data', 'error');
    }
}

// Category Management Functions
async function loadCategories() {
    try {
        const categories = await apiCall(API_ENDPOINTS.CATEGORY.ALL);
        return categories || [];
    } catch (error) {
        console.error('Failed to load categories:', error);
        return [];
    }
}

async function populateCategoryDropdowns() {
    try {
        const categories = await loadCategories();
        
        // Populate inventory form category dropdown
        const inventoryCategorySelect = document.getElementById('item-category');
        if (inventoryCategorySelect) {
            inventoryCategorySelect.innerHTML = '<option value="">Select Category</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.categoryId;
                option.textContent = category.categoryName;
                inventoryCategorySelect.appendChild(option);
            });
        }
        
        // Populate category filter (use categoryName for consistency with filter logic)
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.categoryName; // Use categoryName for filtering
                option.textContent = category.categoryName;
                categoryFilter.appendChild(option);
            });
        }
        
        return categories;
    } catch (error) {
        console.error('Failed to populate category dropdowns:', error);
        return [];
    }
}

async function loadCategoryList() {
    try {
        const categoryList = document.getElementById('category-list');
        if (!categoryList) return;
        
        const categories = await loadCategories();
        
        if (categories && categories.length > 0) {
            categoryList.innerHTML = categories.map(category => `
                <div class="category-item" data-category-id="${category.categoryId}">
                    <div class="category-info">
                        <h5>${category.categoryName}</h5>
                        <p>${category.description || 'No description'}</p>
                    </div>
                    <div class="category-actions">
                        <button class="btn-icon edit-category-btn" onclick="editCategory(${category.categoryId})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-category-btn" onclick="deleteCategory(${category.categoryId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            categoryList.innerHTML = '<div class="no-categories">No categories found. Add your first category above.</div>';
        }
    } catch (error) {
        console.error('Failed to load category list:', error);
        document.getElementById('category-list').innerHTML = '<div class="error">Failed to load categories</div>';
    }
}

async function addCategory(categoryData) {
    try {
        const newCategory = await apiCall(API_ENDPOINTS.CATEGORY.ADD, 'POST', categoryData);
        showToast('Category added successfully', 'success');
        
        // Refresh category lists
        await populateCategoryDropdowns();
        await loadCategoryList();
        
        return newCategory;
    } catch (error) {
        console.error('Failed to add category:', error);
        showToast('Failed to add category', 'error');
        throw error;
    }
}

async function editCategory(categoryId) {
    try {
        const category = await apiCall(`${API_ENDPOINTS.CATEGORY.GET}/${categoryId}`);
        
        if (category) {
            document.getElementById('category-name').value = category.categoryName;
            document.getElementById('category-description').value = category.description || '';
            
            // Store category ID for update
            document.getElementById('category-form').dataset.editCategoryId = category.categoryId;
            
            // Change form button text
            const submitBtn = document.getElementById('category-form').querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Category';
        }
    } catch (error) {
        console.error('Failed to load category for edit:', error);
        showToast('Failed to load category data', 'error');
    }
}

async function deleteCategory(categoryId) {
    try {
        showConfirmModal('Are you sure you want to delete this category?', async () => {
            await apiCall(`${API_ENDPOINTS.CATEGORY.DELETE}/${categoryId}`, 'DELETE');
            showToast('Category deleted successfully', 'success');
            
            // Refresh category lists
            await populateCategoryDropdowns();
            await loadCategoryList();
        });
    } catch (error) {
        console.error('Failed to delete category:', error);
        showToast('Failed to delete category', 'error');
    }
}

// Shipment Management Functions
async function loadShipmentData() {
    try {
        const tbody = document.getElementById('shipment-tbody');
        tbody.innerHTML = '<tr><td colspan="7" class="loading-row"><i class="fas fa-spinner fa-spin"></i> Loading shipment data...</td></tr>';
        
        const shipmentData = await apiCall(API_ENDPOINTS.SHIPMENT.ALL);
        
        if (shipmentData && shipmentData.length > 0) {
            tbody.innerHTML = shipmentData.map(shipment => `
                <tr data-shipment-id="${shipment.shipmentId}">
                    <td>${shipment.shipmentId}</td>
                    <td>${shipment.itemId || 'N/A'}</td>
                    <td>${shipment.origin}</td>
                    <td>${shipment.destination}</td>
                    <td><span class="status-badge ${shipment.status.toLowerCase().replace(' ', '-')}">${shipment.status}</span></td>
                    <td>${new Date(shipment.expectedDeliveryDate).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-icon edit-btn" data-id="${shipment.shipmentId}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" data-id="${shipment.shipmentId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            // Populate status filter
            populateStatusFilter(shipmentData);
        } else {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No shipments found</td></tr>';
        }
    } catch (error) {
        console.error('Failed to load shipment data:', error);
        document.getElementById('shipment-tbody').innerHTML = '<tr><td colspan="7" class="error-row">Failed to load shipment data</td></tr>';
        showToast('Failed to load shipment data', 'error');
    }
}

function populateStatusFilter(shipmentData) {
    const statuses = [...new Set(shipmentData.map(shipment => shipment.status).filter(Boolean))];
    const statusFilter = document.getElementById('status-filter');
    
    // Clear existing options except "All Status"
    statusFilter.innerHTML = '<option value="">All Status</option>';
    
    // Add status options
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });
}

// Space Management Functions
async function loadSpaceData() {
    try {
        const spaceOverview = document.getElementById('space-overview');
        spaceOverview.innerHTML = '<div class="space-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Loading space allocation data...</p></div>';
        
        const spaceData = await apiCall(API_ENDPOINTS.SPACE.VIEW);
        
        if (spaceData && spaceData.length > 0) {
            spaceOverview.innerHTML = spaceData.map(space => `
                <div class="space-card">
                    <h3>Zone ${space.zone}</h3>
                    <div class="space-stats">
                        <div class="space-stat">
                            <span class="stat-label">Total Capacity:</span>
                            <span class="stat-value">${space.totalCapacity} sq ft</span>
                        </div>
                        <div class="space-stat">
                            <span class="stat-label">Used:</span>
                            <span class="stat-value">${space.usedCapacity} sq ft</span>
                        </div>
                        <div class="space-stat">
                            <span class="stat-label">Available:</span>
                            <span class="stat-value">${space.availableCapacity} sq ft</span>
                        </div>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.round((space.usedCapacity / space.totalCapacity) * 100)}%"></div>
                        </div>
                        <span class="progress-text">${Math.round((space.usedCapacity / space.totalCapacity) * 100)}% Used</span>
                    </div>
                    <div class="space-actions">
                        <button class="btn btn-secondary" onclick="allocateSpace(${space.spaceId})">Allocate</button>
                        <button class="btn btn-outline" onclick="freeSpace(${space.spaceId})">Free Space</button>
                    </div>
                </div>
            `).join('');
        } else {
            spaceOverview.innerHTML = '<div class="space-placeholder"><p>No space allocation data found</p></div>';
        }
    } catch (error) {
        console.error('Failed to load space data:', error);
        document.getElementById('space-overview').innerHTML = '<div class="space-placeholder"><p>Failed to load space data</p></div>';
        showToast('Failed to load space data', 'error');
    }
}

// Maintenance Management Functions
let globalMaintenanceData = [];

async function loadMaintenanceData() {
    try {
        const maintenanceTasks = document.getElementById('maintenance-tasks');
        maintenanceTasks.innerHTML = '<div class="task-placeholder"><i class="fas fa-spinner fa-spin"></i><p>Loading maintenance tasks...</p></div>';

        // Fetch maintenance data from backend
        const maintenanceData = await apiCall(API_ENDPOINTS.MAINTENANCE.VIEW);
        globalMaintenanceData = maintenanceData || [];

        if (maintenanceData && maintenanceData.length > 0) {
            maintenanceTasks.innerHTML = maintenanceData.map(maintenance => `
                <div class="task-item">
                    <div class="task-info">
                        <h4>Equipment #${maintenance.equipmentId} - ${maintenance.taskDescription}</h4>
                        <p>${maintenance.taskDescription}</p>
                        <span class="task-date">${new Date(maintenance.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div class="task-status">
                        <span class="status-badge ${maintenance.completionStatus.toLowerCase().replace(' ', '-')}">${maintenance.completionStatus}</span>
                        <button class="btn-icon" onclick="editMaintenance(${maintenance.scheduleId})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            maintenanceTasks.innerHTML = '<div class="task-placeholder"><p>No maintenance tasks found</p></div>';
        }
        // Re-render calendar to update maintenance highlights
        renderCalendar();
    } catch (error) {
        console.error('Failed to load maintenance data:', error);
        document.getElementById('maintenance-tasks').innerHTML = '<div class="task-placeholder"><p>Failed to load maintenance data</p></div>';
        showToast('Failed to load maintenance data', 'error');
    }
}
// Modal Functionality
function initializeModals() {
 // Item Modal
 const addItemBtn = document.getElementById('add-item-btn');
 const itemModalClose = document.getElementById('item-modal-close');
 const itemModalCancel = document.getElementById('item-modal-cancel');
 
 addItemBtn.addEventListener('click', () => openModal(itemModal, 'Add New Item')),
 itemModalClose.addEventListener('click', () => closeModal(itemModal));
 itemModalCancel.addEventListener('click', () => closeModal(itemModal));
 
 // Shipment Modal
 const addShipmentBtn = document.getElementById('add-shipment-btn');
 const shipmentModalClose = document.getElementById('shipment-modal-close');
 const shipmentModalCancel = 
document.getElementById('shipment-modal-cancel');
 
 addShipmentBtn.addEventListener('click', () => openModal(shipmentModal, 'New Shipment'));
 shipmentModalClose.addEventListener('click', () => 
closeModal(shipmentModal));
 shipmentModalCancel.addEventListener('click', () => 
closeModal(shipmentModal));
 
 // Maintenance Modal
 const addMaintenanceBtn = document.getElementById('add-maintenance-btn');
 const maintenanceModalClose = 
document.getElementById('maintenance-modal-close');
 const maintenanceModalCancel = 
document.getElementById('maintenance-modal-cancel');
 
 addMaintenanceBtn.addEventListener('click', () => 
openModal(maintenanceModal, 'Schedule Maintenance'));
 maintenanceModalClose.addEventListener('click', () => 
closeModal(maintenanceModal));
 maintenanceModalCancel.addEventListener('click', () => 
closeModal(maintenanceModal));
 
 // Confirm Modal
 const confirmModalClose = document.getElementById('confirm-modal-close');
 const confirmCancel = document.getElementById('confirm-cancel');
 
 confirmModalClose.addEventListener('click', () => closeModal(confirmModal));
 confirmCancel.addEventListener('click', () => closeModal(confirmModal));
 
 // Close modals when clicking outside
 document.addEventListener('click', function(e) {
 if (e.target.classList.contains('modal')) {
 closeModal(e.target);
 }
 });
 
 // Close modals with Escape key
 document.addEventListener('keydown', function(e) {
 if (e.key === 'Escape') {
 closeAllModals();
 }
 });
 
 // Initialize edit and delete buttons
 initializeTableActions();
 
 // Populate shipment item dropdown when modal opens
 if (shipmentModal) {
     // Remove the incorrect event listener
     // shipmentModal.addEventListener('show', populateShipmentItemDropdown);
 }
 
 // Category Modal
 const categoryModal = document.getElementById('category-modal');
 const manageCategoriesBtn = document.getElementById('manage-categories-btn');
 const categoryModalClose = document.getElementById('category-modal-close');
 const categoryForm = document.getElementById('category-form');
 
 if (manageCategoriesBtn && categoryModal) {
     manageCategoriesBtn.addEventListener('click', () => {
         openModal(categoryModal, 'Manage Categories');
         loadCategoryList();
     });
 }
 
 if (categoryModalClose) {
     categoryModalClose.addEventListener('click', () => closeModal(categoryModal));
 }
 
 if (categoryForm) {
     categoryForm.addEventListener('submit', async function(e) {
         e.preventDefault();
         
         try {
             showLoading();
             
             const formData = new FormData(categoryForm);
             const categoryData = {
                 categoryName: formData.get('categoryName'),
                 description: formData.get('description')
             };
             
             const editCategoryId = categoryForm.dataset.editCategoryId;
             
             if (editCategoryId) {
                 // Update existing category
                 await apiCall(`${API_ENDPOINTS.CATEGORY.UPDATE}/${editCategoryId}`, 'PUT', categoryData);
                 showToast('Category updated successfully', 'success');
                 delete categoryForm.dataset.editCategoryId;
                 
                 // Reset form button text
                 const submitBtn = categoryForm.querySelector('button[type="submit"]');
                 submitBtn.textContent = 'Add Category';
             } else {
                 // Add new category
                 await addCategory(categoryData);
             }
             
             // Reset form
             categoryForm.reset();
             
         } catch (error) {
             console.error('Failed to save category:', error);
             showToast('Failed to save category', 'error');
         } finally {
             hideLoading();
         }
     });
 }
 
 // Space Modal
 const spaceModal = document.getElementById('space-modal');
 const allocateSpaceBtn = document.getElementById('allocate-space-btn');
 const spaceModalClose = document.getElementById('space-modal-close');
 const spaceModalCancel = document.getElementById('space-modal-cancel');
 const spaceForm = document.getElementById('space-form');
 
 if (allocateSpaceBtn && spaceModal) {
     allocateSpaceBtn.addEventListener('click', () => {
         openModal(spaceModal, 'Allocate Space');
     });
 }
 
 if (spaceModalClose) {
     spaceModalClose.addEventListener('click', () => closeModal(spaceModal));
 }
 
 if (spaceModalCancel) {
     spaceModalCancel.addEventListener('click', () => closeModal(spaceModal));
 }
 
          if (spaceForm) {
             spaceForm.addEventListener('submit', async function(e) {
                 e.preventDefault();
                 await handleSpaceSubmit();
             });
             
             // Add real-time calculation of available capacity
             const totalCapacityInput = document.getElementById('space-total');
             const usedCapacityInput = document.getElementById('space-used');
             const availableCapacityInput = document.getElementById('space-available');
             
             if (totalCapacityInput && usedCapacityInput && availableCapacityInput) {
                 const calculateAvailable = () => {
                     const total = parseInt(totalCapacityInput.value) || 0;
                     const used = parseInt(usedCapacityInput.value) || 0;
                     const available = Math.max(0, total - used);
                     availableCapacityInput.value = available;
                 };
                 
                 totalCapacityInput.addEventListener('input', calculateAvailable);
                 usedCapacityInput.addEventListener('input', calculateAvailable);
                 
                 // Initialize calculation
                 calculateAvailable();
             }
         }
}
function openModal(modal, title = '') {
    if (title) {
        const titleElement = modal.querySelector('.modal-header h3');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Special handling for shipment modal - populate item dropdown
    if (modal.id === 'shipment-modal') {
        populateShipmentItemDropdown();
    }
}
function closeModal(modal) {
 modal.classList.remove('show');
 document.body.style.overflow = '';
 
 // Reset form if exists
 const form = modal.querySelector('form');
 if (form) {
 form.reset();
 }
}
function closeAllModals() {
 const modals = document.querySelectorAll('.modal');
 modals.forEach(modal => closeModal(modal));
}
function showConfirmModal(message, onConfirm) {
 const confirmMessage = document.getElementById('confirm-message');
 const confirmAction = document.getElementById('confirm-action');
 
 confirmMessage.textContent = message;
 
 // Remove previous event listeners
 const newConfirmAction = confirmAction.cloneNode(true);
 confirmAction.parentNode.replaceChild(newConfirmAction, confirmAction);
 
 newConfirmAction.addEventListener('click', () => {
 onConfirm();
 closeModal(confirmModal);
 });
 
 openModal(confirmModal, 'Confirm Action');
}
// Table Actions
function initializeTableActions() {
 // Edit buttons
 document.addEventListener('click', function(e) {
 if (e.target.closest('.edit-btn')) {
 const btn = e.target.closest('.edit-btn');
 const row = btn.closest('tr');
 const table = row.closest('table');
 
 if (table.id === 'inventory-table') {
 editInventoryItem(row);
 } else if (table.id === 'shipment-table') {
 editShipment(row);
 }
 }
 });
 
 // Delete buttons
 document.addEventListener('click', function(e) {
 if (e.target.closest('.delete-btn')) {
 const btn = e.target.closest('.delete-btn');
 const row = btn.closest('tr');
 const table = row.closest('table');
 
 if (table.id === 'inventory-table') {
 deleteInventoryItem(row);
 } else if (table.id === 'shipment-table') {
 deleteShipment(row);
 }
 }
 });
}
function editInventoryItem(row) {
    const itemId = row.dataset.itemId || row.getAttribute('data-id');
    if (!itemId) {
        showToast('Item ID not found for edit', 'error');
        return;
    }
    loadInventoryItemForEdit(itemId);
    itemForm.dataset.editBtn = itemId;
    openModal(itemModal, 'Edit Item');
}
async function deleteInventoryItem(row) {
    const itemName = row.cells[0].textContent;
    const itemId = row.dataset.itemId;
    
    showConfirmModal(`Are you sure you want to delete "${itemName}"?`, async () => {
        try {
            showLoading();
            await apiCall(`${API_ENDPOINTS.INVENTORY.REMOVE}/${itemId}`, 'DELETE');
            row.remove();
            showToast(`Item "${itemName}" deleted successfully`, 'success');
            
            // Refresh dashboard data
            await loadDashboardData();
        } catch (error) {
            console.error('Failed to delete item:', error);
            showToast('Failed to delete item', 'error');
        } finally {
            hideLoading();
        }
    });
}
function editShipment(row) {
    const shipmentId = row.dataset.shipmentId || row.getAttribute('data-id');
    if (!shipmentId) {
        showToast('Shipment ID not found for edit', 'error');
        return;
    }
    // Load shipment data for edit (implement if needed)
    shipmentForm.dataset.editBtn = shipmentId;
    // Populate form fields from row
    const cells = row.cells;
    document.getElementById('shipment-item').value = cells[1].textContent;
    document.getElementById('shipment-origin').value = cells[2].textContent;
    document.getElementById('shipment-destination').value = cells[3].textContent;
    document.getElementById('shipment-status').value = cells[4].textContent.replace(/[^ -]/g, '').trim();
    openModal(shipmentModal, 'Edit Shipment');
}
async function deleteShipment(row) {
    const shipmentId = row.dataset.shipmentId || row.getAttribute('data-id');
    if (!shipmentId) {
        showToast('Shipment ID not found for delete', 'error');
        return;
    }
    showConfirmModal(`Are you sure you want to delete shipment "${shipmentId}"?`, async () => {
        try {
            showLoading();
            await apiCall(`${API_ENDPOINTS.SHIPMENT.DELETE}/${shipmentId}`, 'DELETE');
            row.remove();
            showToast(`Shipment "${shipmentId}" deleted successfully`, 'success');
            await loadDashboardData();
        } catch (error) {
            console.error('Failed to delete shipment:', error);
            showToast('Failed to delete shipment', 'error');
        } finally {
            hideLoading();
        }
    });
}
// Form Functionality
function initializeForms() {
 // Item Form
 itemForm.addEventListener('submit', function(e) {
 e.preventDefault();
 handleItemSubmit();
 });
 
 // Shipment Form
 shipmentForm.addEventListener('submit', function(e) {
 e.preventDefault();
 handleShipmentSubmit();
 });
 
 // Maintenance Form
 maintenanceForm.addEventListener('submit', function(e) {
 e.preventDefault();
 handleMaintenanceSubmit();
 });
}
async function handleItemSubmit() {
    try {
        showLoading();
        
        const formData = new FormData(itemForm);
        const categoryValue = formData.get('category');
        const itemData = {
            itemName: formData.get('itemName'),
            categoryId: categoryValue && categoryValue.trim() !== '' ? parseInt(categoryValue) : null,
            quantity: parseInt(formData.get('quantity')),
            location: formData.get('location')
        };
        
        const editItemId = itemForm.dataset.editBtn;
        
        if (editItemId) {
            // Update existing item
            itemData.itemId = parseInt(editItemId);
            await apiCall(API_ENDPOINTS.INVENTORY.UPDATE, 'PUT', itemData);
            showToast('Item updated successfully', 'success');
            delete itemForm.dataset.editBtn;
        } else {
            // Add new item
            await apiCall(API_ENDPOINTS.INVENTORY.ADD, 'POST', itemData);
            showToast('Item added successfully', 'success');
        }
        
        // Refresh inventory data and dashboard
        await loadInventoryData();
        await loadDashboardData();
        closeModal(itemModal);
        
    } catch (error) {
        console.error('Failed to save item:', error);
        showToast('Failed to save item', 'error');
    } finally {
        hideLoading();
    }
}
async function handleShipmentSubmit() {
    try {
        showLoading();
        const formData = new FormData(shipmentForm);
        const itemIdInput = formData.get('itemId');
        if (!itemIdInput || itemIdInput.trim() === '') {
            hideLoading();
            showToast('Item ID is required', 'error');
            return;
        }
        const shipmentData = {
            itemId: parseInt(itemIdInput),
            origin: formData.get('origin'),
            destination: formData.get('destination'),
            status: formData.get('status'),
            expectedDeliveryDate: new Date().toISOString()
        };
        const editShipmentId = shipmentForm.dataset.editBtn;
        if (editShipmentId) {
            // Update existing shipment
            await apiCall(`${API_ENDPOINTS.SHIPMENT.DISPATCH}/${editShipmentId}`, 'PUT', shipmentData);
            showToast('Shipment updated successfully', 'success');
            delete shipmentForm.dataset.editBtn;
        } else {
            // Create new shipment
            await apiCall(API_ENDPOINTS.SHIPMENT.RECEIVE, 'POST', shipmentData);
            showToast('Shipment created successfully', 'success');
        }
        await loadShipmentData();
        await loadDashboardData();
        closeModal(shipmentModal);
        shipmentForm.reset();
    } catch (error) {
        console.error('Failed to create/update shipment:', error);
        showToast('Failed to create/update shipment: ' + (error.message || 'Unknown error'), 'error');
    } finally {
        hideLoading();
    }
}
async function handleMaintenanceSubmit() {
    try {
        showLoading();
        
        const formData = new FormData(maintenanceForm);
        const maintenanceData = {
            equipmentId: parseInt(formData.get('equipmentId')),
            taskDescription: formData.get('taskDescription'),
            scheduledDate: formData.get('scheduledDate'),
            completionStatus: formData.get('completionStatus')
        };
        
        const editScheduleId = maintenanceForm.dataset.editScheduleId;
        
        if (editScheduleId) {
            // Update existing maintenance
            maintenanceData.scheduleId = parseInt(editScheduleId);
            await apiCall(API_ENDPOINTS.MAINTENANCE.UPDATE, 'PUT', maintenanceData);
            showToast('Maintenance updated successfully', 'success');
            delete maintenanceForm.dataset.editScheduleId;
        } else {
            // Schedule new maintenance
            await apiCall(API_ENDPOINTS.MAINTENANCE.SCHEDULE, 'POST', maintenanceData);
            showToast('Maintenance scheduled successfully', 'success');
        }
        
        // Refresh maintenance data
        await loadMaintenanceData();
        closeModal(maintenanceModal);
        maintenanceForm.reset(); // <-- Add this line to reset form only once
        
    } catch (error) {
        console.error('Failed to save maintenance:', error);
        showToast('Failed to save maintenance', 'error');
    } finally {
        hideLoading();
    }
} // <-- Add this closing bracket to properly end handleMaintenanceSubmit

async function handleSpaceSubmit() {
    try {
        showLoading();
        
        const formData = new FormData(document.getElementById('space-form'));
        const zone = formData.get('zone');
        const totalCapacity = parseInt(formData.get('totalCapacity'));
        const usedCapacity = parseInt(formData.get('usedCapacity'));
        
        if (!zone) {
            showToast('Please select a zone', 'error');
            return;
        }
        
        const spaceData = {
            zone: zone,
            totalCapacity: totalCapacity,
            usedCapacity: usedCapacity,
            availableCapacity: Math.max(0, totalCapacity - usedCapacity)
        };
        
        // Call the space allocation API
        await apiCall(API_ENDPOINTS.SPACE.ALLOCATE, 'POST', spaceData);
        showToast('Space allocated successfully', 'success');
        
        // Refresh space data and dashboard
        await loadSpaceData();
        await loadDashboardData();
        closeModal(document.getElementById('space-modal'));
        
        // Reset form
        document.getElementById('space-form').reset();
        
        // Recalculate available capacity
        const availableCapacityInput = document.getElementById('space-available');
        if (availableCapacityInput) {
            availableCapacityInput.value = '';
        }
        
    } catch (error) {
        console.error('Failed to allocate space:', error);
        showToast('Failed to allocate space', 'error');
    } finally {
        hideLoading();
    }
}
// Calendar Functionality
function initializeCalendar() {
 if (!calendarGrid) return;
 
 prevMonth.addEventListener('click', () => changeMonth(-1));
 nextMonth.addEventListener('click', () => changeMonth(1));
 
 renderCalendar();
}
let currentDate = new Date();
function changeMonth(delta) {
 currentDate.setMonth(currentDate.getMonth() + delta);
 renderCalendar();
}
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
    });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        calendarGrid.appendChild(dayHeader);
    });
    
    // Prepare maintenance dates for current month
    const maintenanceDates = (globalMaintenanceData || [])
        .filter(m => m.completionStatus && m.completionStatus.toLowerCase() === 'pending' && new Date(m.scheduledDate).getMonth() === month && new Date(m.scheduledDate).getFullYear() === year)
        .map(m => new Date(m.scheduledDate).getDate());
    
    // Add calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
    
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
    
        // Check if it's today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
    
        // Mark maintenance days (pending only)
        if (maintenanceDates.includes(date.getDate()) && date.getMonth() === month && date.getFullYear() === year) {
            dayElement.classList.add('has-maintenance');
            dayElement.title = 'Pending Maintenance';
        }
    
        calendarGrid.appendChild(dayElement);
    }
}
// Reports Functionality
function initializeReports() {
 if (!generateReportBtn) return;
 
 generateReportBtn.addEventListener('click', generateReport);
}

async function generateReport() {
    try {
        showLoading();
        const reportTypeValue = reportType.value;
        const dateRangeValue = dateRange.value;
        const reportData = {
            reportType: reportTypeValue,
            details: `${reportTypeValue} report for the last ${dateRangeValue} days`
        };
        const generatedReport = await apiCall(API_ENDPOINTS.REPORT.GENERATE, 'POST', reportData);
        if (generatedReport) {
            const reportContent = generateReportContent(reportTypeValue, dateRangeValue, generatedReport);
            reportPreview.innerHTML = reportContent;
            downloadReportBtn.disabled = false;
            showToast('Report generated successfully', 'success');
        }
    } catch (error) {
        console.error('Failed to generate report:', error);
        showToast('Failed to generate report', 'error');
    } finally {
        hideLoading();
    }
}

function downloadReport() {
 const reportTypeValue = reportType.value;
 const dateRangeValue = dateRange.value;
 
 // Create a temporary link to download the report
 const link = document.createElement('a');
 link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
 `${reportTypeValue.toUpperCase()} REPORT\n` +
 `Generated on: ${new Date().toLocaleDateString()}\n` +
 `Date Range: Last ${dateRangeValue} days\n\n` +
 `This is a sample report for the Logistics Warehouse Management System.`
 );
 link.download = `${reportTypeValue}_report_${new 
Date().toISOString().split('T')[0]}.txt`;
 link.click();
 
 showToast('Report downloaded successfully', 'success');
}

function generateReportContent(reportType, dateRange, reportData) {
    return `
        <div class="report-content">
            <h3>${reportType.toUpperCase()} REPORT</h3>
            <div class="report-stats">
                <div class="report-stat">
                    <h4>Report Type</h4>
                    <p>${reportType}</p>
                </div>
                <div class="report-stat">
                    <h4>Date Range</h4>
                    <p>Last ${dateRange} days</p>
                </div>
                <div class="report-stat">
                    <h4>Generated On</h4>
                    <p>${new Date().toLocaleDateString()}</p>
                </div>
                <div class="report-stat">
                    <h4>Report ID</h4>
                    <p>${reportData.reportId || 'N/A'}</p>
                </div>
            </div>
            <div class="report-details">
                <h4>Report Details</h4>
                <p>${reportData.details || 'No additional details available.'}</p>
            </div>
            <div class="report-chart">
                <h4>Summary Data</h4>
                <div class="chart-bars">
                    <div class="chart-bar">
                        <span>Data Points</span>
                        <div class="bar" style="width: 80%;">80%</div>
                    </div>
                    <div class="chart-bar">
                        <span>Completeness</span>
                        <div class="bar" style="width: 95%;">95%</div>
                    </div>
                    <div class="chart-bar">
                        <span>Accuracy</span>
                        <div class="bar" style="width: 90%;">90%</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility Functions
function showLoading() {
 loadingSpinner.classList.add('show');
}
function hideLoading() {
 loadingSpinner.classList.remove('show');
}
function showToast(message, type = 'info') {
 const toast = document.createElement('div');
 toast.className = `toast ${type}`;
 toast.innerHTML = `
 <div class="toast-content">
 <i class="fas fa-${getToastIcon(type)}"></i>
 <span>${message}</span>
 </div>
 `;
 
 toastContainer.appendChild(toast);
 
 // Show toast
 setTimeout(() => toast.classList.add('show'), 100);
 
 // Remove toast after 5 seconds
 setTimeout(() => {
 toast.classList.remove('show');
 setTimeout(() => toast.remove(), 300);
 }, 5000);
}
function getToastIcon(type) {
 const icons = {
 success: 'check-circle',
 error: 'exclamation-circle',
 warning: 'exclamation-triangle',
 info: 'info-circle'
 };
 return icons[type] || 'info-circle';
}
// Add CSS for report styling
const reportStyles = `
 .report-content {
 padding: 20px;
 }
 
 .report-content h3 {
 margin-bottom: 20px;
 color: var(--text-primary);
 }
 
 .report-stats {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
 gap: 20px;
 margin-bottom: 30px;
 }
 
 .report-stat {
 text-align: center;
 padding: 20px;
 background-color: var(--bg-secondary);
 border-radius: var(--radius-md);
 border: 1px solid var(--border-color);
 }
 
 .report-stat h4 {
 color: var(--text-secondary);
 font-size: 0.9rem;
 margin-bottom: 8px;
 }
 
 .report-stat p {
 color: var(--text-primary);
 font-size: 1.5rem;
 font-weight: 700;
 }
 
 .report-chart h4 {
 margin-bottom: 16px;
 color: var(--text-primary);
 }
 
 .chart-bars {
 display: flex;
 flex-direction: column;
 gap: 12px;
 }
 
 .chart-bar {
 display: flex;
 align-items: center;
 gap: 12px;
 }
 
 .chart-bar span {
 min-width: 100px;
 color: var(--text-secondary);
 font-size: 0.9rem;
 }
 
 .chart-bar .bar {
 flex: 1;
 height: 24px;
 background-color: var(--primary-color);
 border-radius: var(--radius-sm);
 display: flex;
 align-items: center;
 justify-content: center;
 color: var(--text-white);
 font-size: 0.8rem;
 font-weight: 500;
 transition: var(--transition);
 }
 
 .chart-bar .bar:hover {
 transform: scaleY(1.1);
 }
 
 .toast-content {
 display: flex;
 align-items: center;
 gap: 12px;
 }
 
 .toast-content i {
 font-size: 1.1rem;
 }
`;
// Inject report styles
const styleSheet = document.createElement('style');
styleSheet.textContent = reportStyles;
document.head.appendChild(styleSheet);
// Initialize space allocation buttons
document.addEventListener('click', function(e) {
 if (e.target.textContent === 'Allocate') {
 showToast('Space allocation feature coming soon!', 'info');
 } else if (e.target.textContent === 'Free Space') {
 showToast('Space freeing feature coming soon!', 'info');
 }
});
// Space and Maintenance Action Functions
async function allocateSpace(spaceId) {
    try {
        showLoading();
        
        // This would typically open a modal for space allocation
        // For now, we'll show a toast message
        showToast('Space allocation feature - implement modal for allocation details', 'info');
        
    } catch (error) {
        console.error('Failed to allocate space:', error);
        showToast('Failed to allocate space', 'error');
    } finally {
        hideLoading();
    }
}

async function freeSpace(spaceId) {
    try {
        showLoading();
        
        await apiCall(`${API_ENDPOINTS.SPACE.FREE}/${spaceId}`, 'DELETE');
        showToast('Space freed successfully', 'success');
        
        // Refresh space data
        await loadSpaceData();
        
    } catch (error) {
        console.error('Failed to free space:', error);
        showToast('Failed to free space', 'error');
    } finally {
        hideLoading();
    }
}

async function editMaintenance(scheduleId) {
    try {
        const maintenanceData = await apiCall(`${API_ENDPOINTS.MAINTENANCE.GET}/${scheduleId}`);
        
        if (maintenanceData) {
            document.getElementById('maintenance-equipment').value = maintenanceData.equipmentId;
            document.getElementById('maintenance-description').value = maintenanceData.taskDescription;
            document.getElementById('maintenance-date').value = maintenanceData.scheduledDate.split('T')[0];
            document.getElementById('maintenance-status').value = maintenanceData.completionStatus;
            
            // Store schedule ID for update
            maintenanceForm.dataset.editScheduleId = maintenanceData.scheduleId;
            
            openModal(maintenanceModal, 'Edit Maintenance');
        }
    } catch (error) {
        console.error('Failed to load maintenance for edit:', error);
        showToast('Failed to load maintenance data', 'error');
    }
}

// Populate shipment item dropdown with available inventory
async function populateShipmentItemDropdown() {
    try {
        console.log('Populating shipment item dropdown...');
        const inventoryData = await apiCall(API_ENDPOINTS.INVENTORY.VIEW);
        console.log('Inventory data received:', inventoryData);
        
        const shipmentItemSelect = document.getElementById('shipment-item');
        console.log('Shipment item select element:', shipmentItemSelect);
        
        if (!shipmentItemSelect) {
            console.error('Shipment item select element not found!');
            return;
        }
        
        // Clear existing options except "Select Item"
        shipmentItemSelect.innerHTML = '<option value="">Select Item</option>';
        
        if (inventoryData && inventoryData.length > 0) {
            console.log(`Adding ${inventoryData.length} inventory items to dropdown`);
            inventoryData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.itemId;
                option.textContent = `${item.itemName} (ID: ${item.itemId})`;
                shipmentItemSelect.appendChild(option);
                console.log(`Added option: ${item.itemName} (ID: ${item.itemId})`);
            });
        } else {
            console.warn('No inventory data received or empty array');
        }
    } catch (error) {
        console.error('Failed to populate shipment item dropdown:', error);
    }
}

// Add some sample data and interactions
console.log('LWMS Application initialized successfully!');

// Show available inventory item IDs when shipment modal opens
function showAvailableItemIds() {
    const tbody = inventoryTable.querySelector('tbody');
    if (tbody && tbody.rows.length > 0) {
        const itemIds = [];
        for (let i = 0; i < tbody.rows.length; i++) {
            const row = tbody.rows[i];
            const itemName = row.cells[0].textContent;
            const itemId = `ITM-${String(i + 1).padStart(3, '0')}`;
            itemIds.push(`${itemId} (${itemName})`);
        }
        showToast(`Available Item IDs: ${itemIds.join(', ')}`, 'info');
    } else {
        showToast('No inventory items found. Please add inventory items first.', 'warning');
    }
}

















