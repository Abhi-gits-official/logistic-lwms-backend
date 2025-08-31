package com.cts.lwms.dto;

public class MenuItemDTO {
    private String section;
    private String label;
    private String url;
    private String icon;
    private boolean active;

    // Default constructor
    public MenuItemDTO() {}

    // Constructor with all fields
    public MenuItemDTO(String section, String label, String url, String icon, boolean active) {
        this.section = section;
        this.label = label;
        this.url = url;
        this.icon = icon;
        this.active = active;
    }

    // Getters and Setters
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    @Override
    public String toString() {
        return "MenuItemDTO{" +
                "section='" + section + '\'' +
                ", label='" + label + '\'' +
                ", url='" + url + '\'' +
                ", icon='" + icon + '\'' +
                ", active=" + active +
                '}';
    }
} 