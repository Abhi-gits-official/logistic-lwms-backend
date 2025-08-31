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
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
 initializeApp();
});
function initializeApp() {
 // Initialize sidebar
 initializeSidebar();
 
 // Initialize navigation
 initializeNavigation();
 
 // Initialize theme
 initializeTheme();
 
 // Initialize user menu
 initializeUserMenu();
 
 // Initialize search functionality
 initializeSearch();
 
 // Initialize filters
 initializeFilters();
 
 // Initialize modals
 initializeModals();
 
 // Initialize forms
 initializeForms();
 
 // Initialize calendar
 initializeCalendar();
 
 // Initialize reports
 initializeReports();
 
 // Show loading spinner briefly
 showLoading();
 setTimeout(hideLoading, 1000);
}
// Sidebar Functionality
function initializeSidebar() {
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
  sidebar.classList.toggle('collapsed');

  if (window.innerWidth <= 1024) {
    sidebar.classList.toggle('show');
  }
}

document.addEventListener('DOMContentLoaded', initializeSidebar);

 // On mobile, show/hide sidebar
 if (window.innerWidth <= 1024) {
 sidebar.classList.toggle('show');
 }

// Navigation Functionality
function initializeNavigation() {
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
 if (window.innerWidth <= 1024) {
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
}
// Theme Functionality
function initializeTheme() {
 // Load saved theme
 const savedTheme = localStorage.getItem('theme');
 if (savedTheme) {
 document.body.className = savedTheme;
 themeSwitch.checked = savedTheme === 'dark-mode';
 }
 
 themeSwitch.addEventListener('change', toggleTheme);
}
function toggleTheme() {
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
 userBtn.addEventListener('click', toggleUserDropdown);
 
 // Close dropdown when clicking outside
 document.addEventListener('click', function(e) {
 if (!userBtn.contains(e.target)) {
 userDropdown.classList.remove('show');
 }
 });
}
function toggleUserDropdown() {
 userDropdown.classList.toggle('show');
}
// Search Functionality
function initializeSearch() {
 // Global search
 globalSearch.addEventListener('input', function() {
 const searchTerm = this.value.toLowerCase();
 // Implement global search logic here
 console.log('Global search:', searchTerm);
 });
 
 // Inventory search
 inventorySearch.addEventListener('input', function() {
 filterInventoryTable();
 });
 
 // Shipment search
 shipmentSearch.addEventListener('input', function() {
 filterShipmentTable();
 });
}
function filterInventoryTable() {
 const searchTerm = inventorySearch.value.toLowerCase();
 const categoryFilterValue = categoryFilter.value;
 const rows = inventoryTable.querySelectorAll('tbody tr');
 
 rows.forEach(row => {
 const itemName = row.cells[0].textContent.toLowerCase();
 const category = row.cells[1].textContent.toLowerCase();
 const quantity = row.cells[2].textContent;
 const location = row.cells[3].textContent.toLowerCase();
 
 const matchesSearch = itemName.includes(searchTerm) || 
 quantity.includes(searchTerm) || 
 location.includes(searchTerm);
 
 const matchesCategory = !categoryFilterValue || 
category.includes(categoryFilterValue.toLowerCase());
 
 if (matchesSearch && matchesCategory) {
 row.style.display = '';
 } else {
 row.style.display = 'none';
 }
 });
}
function filterShipmentTable() {
 const searchTerm = shipmentSearch.value.toLowerCase();
 const statusFilterValue = statusFilter.value;
 const rows = shipmentTable.querySelectorAll('tbody tr');
 
 rows.forEach(row => {
 const shipmentId = row.cells[0].textContent.toLowerCase();
 const itemId = row.cells[1].textContent.toLowerCase();
 const origin = row.cells[2].textContent.toLowerCase();
 const destination = row.cells[3].textContent.toLowerCase();
 const status = row.cells[4].textContent.toLowerCase();
 
 const matchesSearch = shipmentId.includes(searchTerm) || 
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
 categoryFilter.addEventListener('change', filterInventoryTable);
 statusFilter.addEventListener('change', filterShipmentTable);
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
 const cells = row.cells;
 const itemName = cells[0].textContent;
 const category = cells[1].textContent.replace(/[^\w\s]/g, '').trim();
 const quantity = cells[2].textContent;
 const location = cells[3].textContent;
 
 // Populate form
 document.getElementById('item-name').value = itemName;
 document.getElementById('item-category').value = category;
 document.getElementById('item-quantity').value = quantity;
 document.getElementById('item-location').value = location;
 
 openModal(itemModal, 'Edit Item');
}
function deleteInventoryItem(row) {
 const itemName = row.cells[0].textContent;
 showConfirmModal(`Are you sure you want to delete "${itemName}"?`, () => {
 row.remove();
 showToast(`Item "${itemName}" deleted successfully`, 'success');
 });
}
function editShipment(row) {
 const cells = row.cells;
 const itemId = cells[1].textContent;
 const origin = cells[2].textContent;
 const destination = cells[3].textContent;
 const status = cells[4].textContent.replace(/[^\w\s]/g, '').trim();
 
 // Populate form
 document.getElementById('shipment-item').value = itemId;
 document.getElementById('shipment-origin').value = origin;
 document.getElementById('shipment-destination').value = destination;
 document.getElementById('shipment-status').value = status;
 
 openModal(shipmentModal, 'Edit Shipment');
}
function deleteShipment(row) {
 const shipmentId = row.cells[0].textContent;
 showConfirmModal(`Are you sure you want to delete shipment 
"${shipmentId}"?`, () => {
 row.remove();
 showToast(`Shipment "${shipmentId}" deleted successfully`, 'success');
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
function handleItemSubmit() {
 showLoading();
 
 const formData = new FormData(itemForm);
 const itemData = {
 itemName: formData.get('itemName'),
 category: formData.get('category'),
 quantity: formData.get('quantity'),
 location: formData.get('location')
 };
 
 // Simulate API call
 setTimeout(() => {
 hideLoading();
 
 // Add new row to table
 const tbody = inventoryTable.querySelector('tbody');
 const newRow = tbody.insertRow();
 
 newRow.innerHTML = `
 <td>${itemData.itemName}</td>
 <td><span class="category-badge 
${itemData.category.toLowerCase()}">${itemData.category}</span></td>
 <td>${itemData.quantity}</td>
 <td>${itemData.location}</td>
 <td>${new Date().toISOString().split('T')[0]}</td>
 <td>
 <button class="btn-icon edit-btn">
 <i class="fas fa-edit"></i>
 </button>
 <button class="btn-icon delete-btn">
 <i class="fas fa-trash"></i>
 </button>
 </td>
 `;
 
 closeModal(itemModal);
 showToast('Item added successfully', 'success');
 }, 1000);
}
function handleShipmentSubmit() {
 showLoading();
 
 const formData = new FormData(shipmentForm);
 const shipmentData = {
 itemId: formData.get('itemId'),
 origin: formData.get('origin'),
 destination: formData.get('destination'),
 status: formData.get('status')
 };
 
 // Simulate API call
 setTimeout(() => {
 hideLoading();
 
 // Add new row to table
 const tbody = shipmentTable.querySelector('tbody');
 const newRow = tbody.insertRow();
 
 const shipmentId = `SH-2024-${String(tbody.rows.length + 1).padStart(3, 
'0')}`;
 
 newRow.innerHTML = `
 <td>${shipmentId}</td>
 <td>${shipmentData.itemId}</td>
 <td>${shipmentData.origin}</td>
 <td>${shipmentData.destination}</td>
 <td><span class="status-badge 
${shipmentData.status.toLowerCase().replace(' ', 
'-')}">${shipmentData.status}</span></td>
 <td>${new Date().toISOString().split('T')[0]}</td>
 <td>
 <button class="btn-icon edit-btn">
 <i class="fas fa-edit"></i>
 </button>
 <button class="btn-icon delete-btn">
 <i class="fas fa-trash"></i>
 </button>
 </td>
 `;
 
 closeModal(shipmentModal);
 showToast('Shipment created successfully', 'success');
 }, 1000);
}
function handleMaintenanceSubmit() {
 showLoading();
 
 const formData = new FormData(maintenanceForm);
 const maintenanceData = {
 equipmentId: formData.get('equipmentId'),
 taskDescription: formData.get('taskDescription'),
 scheduledDate: formData.get('scheduledDate'),
 completionStatus: formData.get('completionStatus')
 };
 
 // Simulate API call
 setTimeout(() => {
 hideLoading();
 
 // Add new task to list
 const taskList = document.querySelector('.task-list');
 const newTask = document.createElement('div');
 newTask.className = 'task-item';
 newTask.innerHTML = `
 <div class="task-info">
 <h4>${maintenanceData.equipmentId} - 
${maintenanceData.taskDescription}</h4>
 <p>${maintenanceData.taskDescription}</p>
 <span class="task-date">${maintenanceData.scheduledDate}</span>
 </div>
 <div class="task-status">
 <span class="status-badge 
${maintenanceData.completionStatus.toLowerCase().replace(' ', 
'-')}">${maintenanceData.completionStatus}</span>
 <button class="btn-icon">
 <i class="fas fa-edit"></i>
 </button>
 </div>
 `;
 
 taskList.appendChild(newTask);
 
 closeModal(maintenanceModal);
 showToast('Maintenance scheduled successfully', 'success');
 }, 1000);
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
 
 currentMonth.textContent = new Date(year, month).toLocaleDateString('en-US',
{ 
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
 
 // Check if it has maintenance (simulate some dates)
 const maintenanceDates = [20, 22, 25]; // Sample dates
 if (maintenanceDates.includes(date.getDate()) && date.getMonth() === 
month) {
 dayElement.classList.add('has-maintenance');
 }
 
 calendarGrid.appendChild(dayElement);
 }
}
// Reports Functionality
function initializeReports() {
 if (!generateReportBtn) return;
 
 generateReportBtn.addEventListener('click', generateReport);
 downloadReportBtn.addEventListener('click', downloadReport);
}
function generateReport() {
 const reportTypeValue = reportType.value;
 const dateRangeValue = dateRange.value;
 
 if (!reportTypeValue) {
 showToast('Please select a report type', 'warning');
 return;
 }
 
 showLoading();
 
 // Simulate report generation
 setTimeout(() => {
 hideLoading();
 
 const reportContent = generateReportContent(reportTypeValue, 
dateRangeValue);
 reportPreview.innerHTML = reportContent;
 
 downloadReportBtn.disabled = false;
 showToast('Report generated successfully', 'success');
 }, 2000);
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
// Add some sample data and interactions
console.log('LWMS Application initialized successfully!');

fetch('/inventory/view')
  .then(res => res.json())
  .then(data => { /* update UI */ });

fetch('/inventory/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ itemName: 'Widget', category: 'Tools', quantity: 10, location: 'A1' })
});