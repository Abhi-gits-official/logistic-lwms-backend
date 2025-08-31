package com.cts.lwms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import com.cts.lwms.service.InventoryService;
import com.cts.lwms.service.ShipmentService;
import com.cts.lwms.service.SpaceService;
import com.cts.lwms.service.CategoryService;
import com.cts.lwms.service.MaintenanceService;
import com.cts.lwms.model.Category;
import com.cts.lwms.model.Inventory;
import com.cts.lwms.model.Shipment;
import com.cts.lwms.model.Space;
import com.cts.lwms.model.MaintenanceSchedule;
import com.cts.lwms.dto.DashboardStatsDTO;
import com.cts.lwms.dto.ActivityDTO;
import com.cts.lwms.dto.MenuItemDTO;

import java.util.*;
// import java.util.stream.Collectors;

@Controller
@RequestMapping("/thymeleaf")
public class ThymeleafController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ShipmentService shipmentService;

    @Autowired
    private SpaceService spaceService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping("/admin/login")
    public String adminLogin(Model model) {
        try {
            model.addAttribute("pageTitle", "InvenSpace - Login");
            model.addAttribute("systemName", "Logistics Warehouse Management System");
            return "admin/login";
        } catch (Exception e) {
            model.addAttribute("error", "Failed to load login page: " + e.getMessage());
            return "error";
        }
    }

    @GetMapping("/admin/home")
    public String adminHome(Model model) {
        try {
            // Add dynamic data to the model
            model.addAttribute("pageTitle", "InvenSpace - Admin Dashboard");
            model.addAttribute("systemName", "Logistics Warehouse Management System");
            
            // Load dashboard data for the home page
            loadDashboardData(model);
            
            // Add service availability status
            model.addAttribute("inventoryServiceAvailable", inventoryService != null);
            model.addAttribute("shipmentServiceAvailable", shipmentService != null);
            model.addAttribute("spaceServiceAvailable", spaceService != null);
            model.addAttribute("categoryServiceAvailable", categoryService != null);
            
            return "admin/home";
        } catch (Exception e) {
            model.addAttribute("error", "Failed to load admin dashboard: " + e.getMessage());
            return "error";
        }
    }

    // Dashboard endpoint removed - redirecting to home instead

    @GetMapping("/test")
    public String testPage(Model model) {
        model.addAttribute("message", "Thymeleaf is working correctly!");
        model.addAttribute("timestamp", System.currentTimeMillis());
        return "test";
    }

    // Helper methods
    private List<MenuItemDTO> createMenuItems(String activeSection) {
        List<MenuItemDTO> menuItems = Arrays.asList(
            new MenuItemDTO("dashboard", "Dashboard", "#", "fas fa-tachometer-alt", "dashboard".equals(activeSection)),
            new MenuItemDTO("inventory", "Inventory", "#", "fas fa-boxes", "inventory".equals(activeSection)),
            new MenuItemDTO("shipment", "Shipment", "#", "fas fa-shipping-fast", "shipment".equals(activeSection)),
            new MenuItemDTO("space", "Space", "#", "fas fa-map-marked-alt", "space".equals(activeSection)),
            new MenuItemDTO("maintenance", "Maintenance", "#", "fas fa-tools", "maintenance".equals(activeSection)),
            new MenuItemDTO("reports", "Reports", "#", "fas fa-chart-bar", "reports".equals(activeSection))
        );
        return menuItems;
    }

    private void loadDashboardData(Model model) {
        try {
            // Load dashboard statistics
            DashboardStatsDTO stats = new DashboardStatsDTO();
            
            // Get inventory count
            List<Inventory> inventoryItems = inventoryService.viewInventory();
            stats.setTotalItems(inventoryItems != null ? inventoryItems.size() : 0);
            stats.setItemsChange("+" + (inventoryItems != null ? inventoryItems.size() : 0) + " items");
            
            // Get shipment count
            List<Shipment> shipments = shipmentService.getAllShipments();
            long activeShipments = shipments != null ? shipments.stream()
                .filter(s -> !"Delivered".equals(s.getStatus()) && !"Cancelled".equals(s.getStatus()))
                .count() : 0;
            stats.setActiveShipments((int) activeShipments);
            stats.setShipmentsChange(activeShipments + " active");
            
            // Get space utilization
            List<Space> spaces = spaceService.viewSpaceUsage();
            if (spaces != null && !spaces.isEmpty()) {
                double totalCapacity = spaces.stream().mapToDouble(Space::getTotalCapacity).sum();
                double usedCapacity = spaces.stream().mapToDouble(Space::getUsedCapacity).sum();
                int utilization = (int) ((usedCapacity / totalCapacity) * 100);
                stats.setSpaceUtilization(utilization + "%");
                stats.setSpaceChange(utilization + "% utilized");
            } else {
                stats.setSpaceUtilization("0%");
                stats.setSpaceChange("No spaces configured");
            }
            
            // Get maintenance count
            List<MaintenanceSchedule> maintenanceSchedules = maintenanceService.viewSchedule();
            long dueMaintenance = maintenanceSchedules != null ? maintenanceSchedules.stream()
                .filter(m -> "Scheduled".equals(m.getCompletionStatus()))
                .count() : 0;
            stats.setMaintenanceDue((int) dueMaintenance);
            stats.setMaintenanceChange(dueMaintenance + " due");
            
            model.addAttribute("dashboardStats", stats);
            model.addAttribute("inventoryItems", inventoryItems != null ? inventoryItems : new ArrayList<>());
            model.addAttribute("shipments", shipments != null ? shipments : new ArrayList<>());
            model.addAttribute("spaceZones", spaces != null ? spaces : new ArrayList<>());
            model.addAttribute("maintenanceSchedules", maintenanceSchedules != null ? maintenanceSchedules : new ArrayList<>());
            
            // Load recent activities
            List<ActivityDTO> activities = createRecentActivities(
                inventoryItems != null ? inventoryItems : new ArrayList<>(),
                shipments != null ? shipments : new ArrayList<>(),
                spaces != null ? spaces : new ArrayList<>()
            );
            model.addAttribute("recentActivities", activities);
            
        } catch (Exception e) {
            // Set default values if services fail
            DashboardStatsDTO stats = new DashboardStatsDTO(0, "Error loading", 0, "Error loading", "0%", "Error loading", 0, "Error loading");
            model.addAttribute("dashboardStats", stats);
            model.addAttribute("recentActivities", new ArrayList<>());
            model.addAttribute("inventoryItems", new ArrayList<>());
            model.addAttribute("shipments", new ArrayList<>());
            model.addAttribute("spaceZones", new ArrayList<>());
            model.addAttribute("maintenanceSchedules", new ArrayList<>());
        }
    }

    private void loadInventoryData(Model model) {
        try {
            List<Inventory> inventoryItems = inventoryService.viewInventory();
            List<Category> categories = categoryService.getAllCategories();
            
            model.addAttribute("inventoryItems", inventoryItems != null ? inventoryItems : new ArrayList<>());
            model.addAttribute("categories", categories != null ? categories : new ArrayList<>());
            
        } catch (Exception e) {
            model.addAttribute("inventoryItems", new ArrayList<>());
            model.addAttribute("categories", new ArrayList<>());
        }
    }

    private void loadShipmentData(Model model) {
        try {
            List<Shipment> shipments = shipmentService.getAllShipments();
            model.addAttribute("shipments", shipments != null ? shipments : new ArrayList<>());
        } catch (Exception e) {
            model.addAttribute("shipments", new ArrayList<>());
        }
    }

    private void loadSpaceData(Model model) {
        try {
            List<Space> spaces = spaceService.viewSpaceUsage();
            model.addAttribute("spaceZones", spaces != null ? spaces : new ArrayList<>());
        } catch (Exception e) {
            model.addAttribute("spaceZones", new ArrayList<>());
        }
    }

    private void loadMaintenanceData(Model model) {
        try {
            List<MaintenanceSchedule> maintenanceSchedules = maintenanceService.viewSchedule();
            model.addAttribute("maintenanceSchedules", maintenanceSchedules != null ? maintenanceSchedules : new ArrayList<>());
        } catch (Exception e) {
            model.addAttribute("maintenanceSchedules", new ArrayList<>());
        }
    }

    private void loadReportsData(Model model) {
        try {
            // Add any report-specific data here
            model.addAttribute("reportTypes", Arrays.asList("Inventory", "Shipment", "Space", "Maintenance"));
        } catch (Exception e) {
            model.addAttribute("reportTypes", new ArrayList<>());
        }
    }

    private List<ActivityDTO> createRecentActivities(List<Inventory> inventoryItems, List<Shipment> shipments, List<Space> spaces) {
        List<ActivityDTO> activities = new ArrayList<>();
        
        try {
            // Add inventory activities
            if (inventoryItems != null && !inventoryItems.isEmpty()) {
                activities.add(new ActivityDTO("Inventory updated: " + inventoryItems.size() + " items", "fas fa-boxes", new Date(), "inventory", "summary"));
            }
            
            // Add shipment activities
            if (shipments != null && !shipments.isEmpty()) {
                activities.add(new ActivityDTO("Shipments tracked: " + shipments.size() + " total", "fas fa-shipping-fast", new Date(), "shipment", "summary"));
            }
            
            // Add space activities
            if (spaces != null && !spaces.isEmpty()) {
                activities.add(new ActivityDTO("Space zones configured: " + spaces.size() + " zones", "fas fa-map-marked-alt", new Date(), "space", "summary"));
            }
            
            // If no activities, add a default one
            if (activities.isEmpty()) {
                activities.add(new ActivityDTO("System initialized successfully", "fas fa-info-circle", new Date(), "system", "init"));
            }
            
        } catch (Exception e) {
            // Add default activity if something goes wrong
            activities.add(new ActivityDTO("System activity monitoring active", "fas fa-exclamation-triangle", new Date(), "system", "monitor"));
        }
        
        return activities;
    }
} 