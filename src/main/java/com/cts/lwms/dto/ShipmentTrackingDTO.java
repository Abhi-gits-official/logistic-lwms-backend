package com.cts.lwms.dto;

import java.util.Date;

public class ShipmentTrackingDTO {
    private Integer shipmentId;
    private String origin;
    private String destination;
    private String status;
    private Date expectedDeliveryDate;
    private Integer itemId; // This will contain the ItemId from the associated inventory

    // Default constructor
    public ShipmentTrackingDTO() {}

    // Constructor with all fields
    public ShipmentTrackingDTO(Integer shipmentId, String origin, String destination, 
                              String status, Date expectedDeliveryDate, Integer itemId) {
        this.shipmentId = shipmentId;
        this.origin = origin;
        this.destination = destination;
        this.status = status;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.itemId = itemId;
    }

    // Getters and Setters
    public Integer getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(Integer shipmentId) {
        this.shipmentId = shipmentId;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(Date expectedDeliveryDate) {
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    @Override
    public String toString() {
        return "ShipmentTrackingDTO{" +
                "shipmentId=" + shipmentId +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", status='" + status + '\'' +
                ", expectedDeliveryDate=" + expectedDeliveryDate +
                ", itemId=" + itemId +
                '}';
    }
} 