package com.cts.lwms.dto;

// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.NotNull;

public class InventoryDTO {
    private Integer itemId;
    private String itemName;
    private Integer categoryId; // For frontend convenience
    private String categoryName; // For display purposes
    private Integer quantity;
    private String location;

    // Getters and setters
    public Integer getItemId() { return itemId; }
    public void setItemId(Integer itemId) { this.itemId = itemId; }
    
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    
    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    @Override
    public String toString() {
        return "InventoryDTO{" +
                "itemId=" + itemId +
                ", itemName='" + itemName + '\'' +
                ", categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", quantity=" + quantity +
                ", location='" + location + '\'' +
                '}';
    }
}
