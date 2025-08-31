package com.cts.lwms.dto;

public class DashboardStatsDTO {
    private Integer totalItems;
    private String itemsChange;
    private Integer activeShipments;
    private String shipmentsChange;
    private String spaceUtilization;
    private String spaceChange;
    private Integer maintenanceDue;
    private String maintenanceChange;

    // Default constructor
    public DashboardStatsDTO() {}

    // Constructor with all fields
    public DashboardStatsDTO(Integer totalItems, String itemsChange, Integer activeShipments, 
                           String shipmentsChange, String spaceUtilization, String spaceChange, 
                           Integer maintenanceDue, String maintenanceChange) {
        this.totalItems = totalItems;
        this.itemsChange = itemsChange;
        this.activeShipments = activeShipments;
        this.shipmentsChange = shipmentsChange;
        this.spaceUtilization = spaceUtilization;
        this.spaceChange = spaceChange;
        this.maintenanceDue = maintenanceDue;
        this.maintenanceChange = maintenanceChange;
    }

    // Getters and Setters
    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public String getItemsChange() { return itemsChange; }
    public void setItemsChange(String itemsChange) { this.itemsChange = itemsChange; }

    public Integer getActiveShipments() { return activeShipments; }
    public void setActiveShipments(Integer activeShipments) { this.activeShipments = activeShipments; }

    public String getShipmentsChange() { return shipmentsChange; }
    public void setShipmentsChange(String shipmentsChange) { this.shipmentsChange = shipmentsChange; }

    public String getSpaceUtilization() { return spaceUtilization; }
    public void setSpaceUtilization(String spaceUtilization) { this.spaceUtilization = spaceUtilization; }

    public String getSpaceChange() { return spaceChange; }
    public void setSpaceChange(String spaceChange) { this.spaceChange = spaceChange; }

    public Integer getMaintenanceDue() { return maintenanceDue; }
    public void setMaintenanceDue(Integer maintenanceDue) { this.maintenanceDue = maintenanceDue; }

    public String getMaintenanceChange() { return maintenanceChange; }
    public void setMaintenanceChange(String maintenanceChange) { this.maintenanceChange = maintenanceChange; }

    @Override
    public String toString() {
        return "DashboardStatsDTO{" +
                "totalItems=" + totalItems +
                ", itemsChange='" + itemsChange + '\'' +
                ", activeShipments=" + activeShipments +
                ", shipmentsChange='" + shipmentsChange + '\'' +
                ", spaceUtilization='" + spaceUtilization + '\'' +
                ", spaceChange='" + spaceChange + '\'' +
                ", maintenanceDue=" + maintenanceDue +
                ", maintenanceChange='" + maintenanceChange + '\'' +
                '}';
    }
} 