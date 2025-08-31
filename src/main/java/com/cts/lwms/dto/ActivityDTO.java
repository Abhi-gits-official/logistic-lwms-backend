package com.cts.lwms.dto;

import java.util.Date;

public class ActivityDTO {
    private String description;
    private String icon;
    private Date timestamp;
    private String type;
    private String entityId;

    // Default constructor
    public ActivityDTO() {}

    // Constructor with all fields
    public ActivityDTO(String description, String icon, Date timestamp, String type, String entityId) {
        this.description = description;
        this.icon = icon;
        this.timestamp = timestamp;
        this.type = type;
        this.entityId = entityId;
    }

    // Getters and Setters
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    @Override
    public String toString() {
        return "ActivityDTO{" +
                "description='" + description + '\'' +
                ", icon='" + icon + '\'' +
                ", timestamp=" + timestamp +
                ", type='" + type + '\'' +
                ", entityId='" + entityId + '\'' +
                '}';
    }
} 